package com.shreyash.jobportal.security;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;

public final class AccessGuard {

    private AccessGuard() {}

    public static boolean isAdmin(Authentication auth) {
        return auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    public static void requireSelfOrAdmin(Authentication auth, String email) {
        if (isAdmin(auth)) return;
        if (email == null || !auth.getName().equalsIgnoreCase(email)) {
            throw new AccessDeniedException("You can only access your own data");
        }
    }
}