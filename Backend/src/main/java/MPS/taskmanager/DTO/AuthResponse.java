package MPS.taskmanager.DTO;

public class AuthResponse {
    private String message;
    private String role;

    public AuthResponse(String message, String role) {
        this.message = message;
        this.role = role;
    }

    // getters
    public String getMessage() {
        return message;
    }
    public String getRole() {
        return role;
    }
}
