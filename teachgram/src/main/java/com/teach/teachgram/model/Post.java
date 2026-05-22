package com.teach.teachgram.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column(nullable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 200)
    private String description;

    private String photoLink;
    private String videoLink;

    @Column(name = "private_post", nullable = false)
    private Boolean isPrivate = false;

    @Column(nullable = false)
    private Integer likesCount = 0; // Contador de curtidas conforme item 10

    // Relacionamento ManyToOne: Muitos posts pertencem a um Usuário
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDate.now();
    }

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Boolean getDeleted() { return deleted; }
    public void setDeleted(Boolean deleted) { this.deleted = deleted; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPhotoLink() { return photoLink; }
    public void setPhotoLink(String photoLink) { this.photoLink = photoLink; }

    public String getVideoLink() { return videoLink; }
    public void setVideoLink(String videoLink) { this.videoLink = videoLink; }

    public Boolean getIsPrivate() { return isPrivate; }
    public void setIsPrivate(Boolean isPrivate) { this.isPrivate = isPrivate; }

    public Integer getLikesCount() { return likesCount; }
    public void setLikesCount(Integer likesCount) { this.likesCount = likesCount; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}