package MPS.taskmanager.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "todos")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private boolean completed = false;
    private int priority; // 1 ⭐, 2 ⭐⭐, 3 ⭐⭐⭐
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public Todo() {}

    public Todo(String title, int priority, LocalDate dueDate, User user) {
        this.title = title;
        this.priority = priority;
        this.dueDate = dueDate;
        this.user = user;
    }
    
    @Transient
    public boolean isOverdue() {
        return !completed && dueDate != null && dueDate.isBefore(LocalDate.now());
    }
    
    public Long getId() { return id; }
    public String gettitle() { return title; }
    public boolean isCompleted() { return completed; }
    public int getPriority() { return priority; }
    public LocalDate getDueDate() { return dueDate; }
    public User getUser() { return user; }

    public void setId(Long id) { this.id = id; }
    public void settitle(String title) { this.title = title; }
    public void setCompleted(boolean completed) { this.completed = completed; }
    public void setPriority(int priority) { this.priority = priority; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setUser(User user) { this.user = user; }
}
