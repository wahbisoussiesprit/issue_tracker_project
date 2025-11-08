package org.ms.apigateway.issuetracker.security;

import lombok.RequiredArgsConstructor;
import org.ms.apigateway.issuetracker.entity.User;
import org.ms.apigateway.issuetracker.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
        String role = user.getRole();
        String prefixed = role != null && role.startsWith("ROLE_") ? role : "ROLE_" + (role == null ? "USER" : role);
        Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(prefixed));
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                authorities
        );
    }
}
