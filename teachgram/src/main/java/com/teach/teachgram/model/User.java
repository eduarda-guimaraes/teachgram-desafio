package com.teach.teachgram.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Boolean deleted = false;

    @Column(nullable = false)
    private LocalDate createdAt;

    private LocalDate updatedAt;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String userName;

    private String phone;

    @Column(nullable = false, unique = true)
    private String mail;

    @Column(nullable = false)
    private String password;

    private String profileLink;
    
    private String bio; // Atributo de biografia/descrição adicionado conforme item 10

    // Relacionamento 1xN: Um usuário tem muitos posts
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Post> posts;

    // Relacionamento NxN: Amigos (Autorelacionamento de Usuário para Usuário)
    @ManyToMany
    @JoinTable(
        name = "user_friends",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "friend_id")
    )
    private Set<User> friends;

    // Executado automaticamente antes de salvar no banco
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

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getMail() { return mail; }
    public void setMail(String mail) { this.mail = mail; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getProfileLink() { return profileLink; }
    public void setProfileLink(String profileLink) { this.profileLink = profileLink; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<Post> getPosts() { return posts; }
    public void setPosts(List<Post> posts) { this.posts = posts; }

    public Set<User> getFriends() { return friends; }
    public void setFriends(Set<User> friends) { this.friends = friends; }
}