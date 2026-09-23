
	package com.example.demo.exception;

	import org.springframework.web.bind.MethodArgumentNotValidException;
	import org.springframework.web.bind.annotation.*;

	import java.util.*;

	@RestControllerAdvice
	public class GlobalExceptionHandler {

	    @ExceptionHandler(MethodArgumentNotValidException.class)
	    public Map<String, List<String>> handleValidationExceptions(
	            MethodArgumentNotValidException ex) {

	        List<String> errors = new ArrayList<>();

	        ex.getBindingResult().getFieldErrors().forEach(error ->
	                errors.add(error.getDefaultMessage())
	        );

	        Map<String, List<String>> result = new HashMap<>();
	        result.put("errors", errors);

	        return result;
	    }
	}
