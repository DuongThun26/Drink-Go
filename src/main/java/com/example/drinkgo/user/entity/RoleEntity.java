package com.example.drinkgo.user.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "code")
    private String code;

    @Column(name = "name")
    private String name;

    @ManyToMany(mappedBy = "roles")
    private List<UserEntity> users;
}
