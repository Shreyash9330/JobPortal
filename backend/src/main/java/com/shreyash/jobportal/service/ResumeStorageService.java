package com.shreyash.jobportal.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.shreyash.jobportal.entity.ResumeFile;
import com.shreyash.jobportal.repository.ResumeFileRepository;

@Service
public class ResumeStorageService {

    private static final Pattern VALID_ID = Pattern.compile("[A-Za-z0-9-]{1,60}\\.pdf");
    private static final byte[] PDF_MAGIC = { '%', 'P', 'D', 'F' };

    private final ResumeFileRepository repository;

    public ResumeStorageService(ResumeFileRepository repository) {
        this.repository = repository;
    }

    /** Validates and stores a PDF, returns the generated file name. */
    public String save(MultipartFile file) throws IOException {
        String original = file.getOriginalFilename();
        if (file.isEmpty() || original == null || !original.toLowerCase().endsWith(".pdf")) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        byte[] bytes = file.getBytes();
        if (!looksLikePdf(bytes)) {
            throw new IllegalArgumentException("Only PDF files are allowed");
        }

        ResumeFile entity = new ResumeFile();
        entity.setId(UUID.randomUUID() + ".pdf");
        entity.setData(bytes);
        entity.setCreatedAt(LocalDateTime.now());
        repository.save(entity);

        return entity.getId();
    }

    public Optional<byte[]> load(String fileName) {
        if (fileName == null || !VALID_ID.matcher(fileName).matches()) {
            return Optional.empty();
        }
        return repository.findById(fileName).map(ResumeFile::getData);
    }

    private boolean looksLikePdf(byte[] bytes) {
        if (bytes.length < PDF_MAGIC.length) {
            return false;
        }
        for (int i = 0; i < PDF_MAGIC.length; i++) {
            if (bytes[i] != PDF_MAGIC[i]) {
                return false;
            }
        }
        return true;
    }
}
