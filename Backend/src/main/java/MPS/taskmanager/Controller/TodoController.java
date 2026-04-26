package MPS.taskmanager.Controller;

import MPS.taskmanager.Entity.Todo;
import MPS.taskmanager.Entity.User;
import MPS.taskmanager.Repository.TodoRepository;
import MPS.taskmanager.Repository.UserRepository;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/todos")
@CrossOrigin(origins = "http://localhost:3000")
public class TodoController {

    private final TodoRepository todoRepo;
    private final UserRepository userRepo;

    public TodoController(TodoRepository todoRepo, UserRepository userRepo) {
        this.todoRepo = todoRepo;
        this.userRepo = userRepo;
    }

    // Admin fetches all todos of a user
    @GetMapping
    public List<Todo> getTodos(@RequestParam(required = false) String username) {
        if (username != null) {
            User user = userRepo.findByUsername(username)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            return todoRepo.findByUser(user);
        } else {
            return todoRepo.findAll(); // admin can see all todos
        }
    }

    // Add new todo and assign to a user
    @PostMapping("/add")
    public Todo addTodo(@RequestBody Todo todo, @RequestParam String username) {
        User user = userRepo.findByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        todo.setUser(user);
        todo.setCompleted(false); // default
        return todoRepo.save(todo);
    }

    // Toggle completion
    @PutMapping("/{id}/toggle")
    public Todo toggleTodo(@PathVariable Long id) {
        Todo todo = todoRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Todo not found"));
        todo.setCompleted(!todo.isCompleted());
        return todoRepo.save(todo);
    }

    @DeleteMapping("/{id}")
    public void deleteTodo(@PathVariable Long id) {
        todoRepo.deleteById(id);
    }
    
    @GetMapping("/users")
    public List<User> getAllUsers() {
    	return userRepo.findAll()
                .stream()
                .filter(u -> !"admin".equalsIgnoreCase(u.getRole())) // exclude admins
                .toList();
}
}
