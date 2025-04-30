package com.form.FormBuilder.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

/**
 * An empty filter that does nothing but pass the request to the next filter in the chain.
 * Used to replace the JWT filter when security is disabled.
 */
public class EmptyFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        // Just pass the request to the next filter
        filterChain.doFilter(request, response);
    }
}