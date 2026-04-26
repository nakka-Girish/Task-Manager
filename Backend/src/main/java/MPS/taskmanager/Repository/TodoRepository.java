package MPS.taskmanager.Repository;

import MPS.taskmanager.Entity.Todo;
import MPS.taskmanager.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    List<Todo> findByUser(User user);
}
