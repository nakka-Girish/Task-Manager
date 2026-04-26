package MPS.taskmanager.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import MPS.taskmanager.Service.UserService;
import MPS.taskmanager.DTO.LoginRequest;
import MPS.taskmanager.DTO.AuthResponse;
import MPS.taskmanager.Entity.User;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest loginRequest) {
        User user = userService.validateUser(loginRequest.getUsername(), loginRequest.getPassword());
        if (user != null) {
            return new AuthResponse("Login Successful!", user.getRole());
        } else {
            return new AuthResponse("Invalid credentials!", null);
        }
    }

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody LoginRequest signupRequest) {
        User user = userService.createUser(signupRequest.getUsername(), signupRequest.getPassword(), "user");
        if (user != null) {
            return new AuthResponse("User registered!", user.getRole());
        } else {
            return new AuthResponse("User already exists!", null);
        }
    }
}
