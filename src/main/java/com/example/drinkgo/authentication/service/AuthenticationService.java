package com.example.drinkgo.authentication.service;

import com.example.drinkgo.authentication.dto.JWTInfor;
import com.example.drinkgo.authentication.dto.TokenPayload;
import com.example.drinkgo.authentication.dto.request.*;
import com.example.drinkgo.authentication.dto.response.ForgotPasswordResponse;
import com.example.drinkgo.authentication.dto.response.LoginResponse;
import com.example.drinkgo.authentication.entity.AccessTokenBlacklist;
import com.example.drinkgo.authentication.entity.RefreshTokenWhitelist;
import com.example.drinkgo.authentication.entity.PasswordResetToken;
import com.example.drinkgo.authentication.repository.AccessTokenBlacklistRepository;
import com.example.drinkgo.authentication.repository.RefreshTokenWhitelistRepository;
import com.example.drinkgo.authentication.repository.PasswordResetTokenRepository;
import com.example.drinkgo.authentication.security.AuthenticationFacade;
import com.example.drinkgo.user.entity.UserEntity;
import com.example.drinkgo.user.repository.UserRepository;
import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final AuthenticationManager authenticationManager;
    private final JWTService jwtService;
    private final AccessTokenBlacklistRepository accessTokenBlacklistRepository;
    private final RefreshTokenWhitelistRepository refreshTokenWhitelistRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final AuthenticationFacade authenticationFacade;

    public LoginResponse login(LoginRequest request){
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword());
        Authentication authenticate = authenticationManager.authenticate(authenticationToken);
        UserEntity user = (UserEntity) authenticate.getPrincipal();
        return issueTokens(user);
    }
    public LoginResponse refresh(RefreshRequest request) throws ParseException, JOSEException {
        String oldRefreshToken = request.getRefreshToken();
        if(oldRefreshToken == null || !jwtService.verifyRefreshToken(oldRefreshToken)){
            throw new BadCredentialsException("Invalid refresh token!");
        }
        JWTInfor jwtInfor = jwtService.parse(oldRefreshToken);
        UserEntity user = userRepository.findByUsername(jwtInfor.getSubject()).orElseThrow(() -> new BadCredentialsException("User not found!"));
        refreshTokenWhitelistRepository.deleteById(jwtInfor.getId());
        return issueTokens(user);
    }
    public LoginResponse issueTokens(UserEntity user){
        TokenPayload refreshTokenPayload = jwtService.generateRefreshToken(user);
        TokenPayload accessTokenPayload = jwtService.generateAccessToken(user, refreshTokenPayload.getJwtId());

        RefreshTokenWhitelist refreshTokenWhitelist = RefreshTokenWhitelist.builder()
                .jwtId(refreshTokenPayload.getJwtId())
                .timeToLive(refreshTokenPayload.getTimeToLive())
                .build();
        refreshTokenWhitelistRepository.save(refreshTokenWhitelist);
        return LoginResponse.builder()
                .accessToken(accessTokenPayload.getToken())
                .refreshToken(refreshTokenPayload.getToken())
                .build();
    }
    public void logout(String token) throws ParseException {
        JWTInfor jwtInfor = jwtService.parse(token);
        String jwtId = jwtInfor.getId();
        Date expirationTime = jwtInfor.getExpirationTime();
        if(expirationTime.before(new Date())) return;
        AccessTokenBlacklist redisToken = AccessTokenBlacklist.builder()
                .jwtId(jwtId)
                .timeToLive(expirationTime.getTime() - new Date().getTime())
                .build();
        accessTokenBlacklistRepository.save(redisToken);
        String refreshJwtId = jwtInfor.getRefreshTokenId();
        if(refreshJwtId != null && refreshTokenWhitelistRepository.existsById(refreshJwtId)){
            refreshTokenWhitelistRepository.deleteById(refreshJwtId);
        }
    }

    public void change(ChangePasswordRequest request){
        // Lấy user hiện tại từ SecurityContext
        UserEntity user = authenticationFacade.getCurrentUser();

        // Verify mật khẩu cũ
        if(user.getPassword() == null || !passwordEncoder.matches(request.getOldPassword(), user.getPassword())){
            throw new BadCredentialsException("Old password is incorrect!");
        }

        // Kiểm tra mật khẩu mới khác mật khẩu cũ
        if(request.getOldPassword().equals(request.getNewPassword())){
            throw new BadCredentialsException("New password must be different from old password!");
        }

        // Hash và lưu mật khẩu mới
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public ForgotPasswordResponse forgot(ForgotPasswordRequest request){
        String identifier = request.getEmail();
        Optional<UserEntity> userOpt;
        if(identifier.contains("@")){
            userOpt = userRepository.findByEmail(identifier);
        } else {
            userOpt = userRepository.findByUsername(identifier);
        }
        if(userOpt.isEmpty()){
            throw new UsernameNotFoundException("User not found!");
        }
        UserEntity user = userOpt.get();
        String token = java.util.UUID.randomUUID().toString();
        long ttl = java.util.concurrent.TimeUnit.HOURS.toMillis(1);
        PasswordResetToken prt = PasswordResetToken.builder()
                .token(token)
                .username(user.getUsername())
                .timeToLive(ttl)
                .build();
        passwordResetTokenRepository.save(prt);
        return ForgotPasswordResponse.builder()
                .resetToken(token)
                .timeToLive(ttl)
                .build();
    }

    public void reset(ResetPasswordRequest request){
        String token = request.getToken();
        Optional<PasswordResetToken> opt = passwordResetTokenRepository.findById(token);
        if(opt.isEmpty()){
            throw new BadCredentialsException("Invalid or expired reset token!");
        }
        String username = opt.get().getUsername();
        UserEntity user = userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("User not found!"));
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordResetTokenRepository.deleteById(token);
    }

}
