package com.example.drinkgo.common.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    private final Cloudinary cloudinary;

    public List<String> upload(List<MultipartFile> files){
        List<String> url = new ArrayList<>();
        try{
            for(MultipartFile file : files){
                Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                url.add(result.get("secure_url").toString());
            }
        }catch(IOException ex){
            throw new RuntimeException("Upload file failed");
        }
        return url;
    }
}
