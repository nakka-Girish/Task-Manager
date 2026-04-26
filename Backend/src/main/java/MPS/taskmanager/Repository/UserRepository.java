package MPS.taskmanager.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import MPS.taskmanager.Entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
}
