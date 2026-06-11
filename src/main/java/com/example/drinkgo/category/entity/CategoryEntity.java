package com.example.drinkgo.category.entity;

import com.example.drinkgo.category.enums.CategoryStatus;
import com.example.drinkgo.common.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "categories")
public class CategoryEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name cannot be blank")
    @Size(min = 1, max = 100)
    @Column(name = "name")
    private String name;

    @Size(min = 1, max = 50)
    @Column(name = "code", unique = true)
    private String code;

    @Size(max = 256)
    @Column(name = "description")
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private CategoryStatus status;
}
