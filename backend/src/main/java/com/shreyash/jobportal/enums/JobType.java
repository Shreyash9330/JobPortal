package com.shreyash.jobportal.enums;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum JobType {
    FULL_TIME("Full Time"),
    PART_TIME("Part Time"),
    INTERNSHIP("Internship"),
    CONTRACT("Contract"),
    REMOTE("Remote");

    private final String label;

    JobType(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static JobType from(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String normalized = value.trim().toUpperCase().replace(' ', '_').replace('-', '_');
        for (JobType type : values()) {
            if (type.name().equals(normalized)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Invalid job type: " + value);
    }
}