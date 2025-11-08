package org.ms.apigateway.issuetracker.service;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.User;
import org.ms.apigateway.issuetracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public Optional<User> updateUser(Long id, User updated) {
        return userRepository.findById(id).map(existing -> {
            existing.setUsername(updated.getUsername());
            existing.setEmail(updated.getEmail());
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                existing.setPassword(passwordEncoder.encode(updated.getPassword()));
            }
            existing.setRole(updated.getRole());
            return userRepository.save(existing);
        });
    }
}
