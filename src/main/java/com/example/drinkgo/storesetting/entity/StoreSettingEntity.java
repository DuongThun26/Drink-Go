package com.example.drinkgo.storesetting.entity;

import com.example.drinkgo.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "storesettings")
public class StoreSettingEntity extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "isopen")
    private Boolean isOpen;
}
