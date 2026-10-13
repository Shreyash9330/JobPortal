package com.shreyash.jobportal.service;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockMultipartFile;

import com.shreyash.jobportal.entity.ResumeFile;
import com.shreyash.jobportal.repository.ResumeFileRepository;

class ResumeStorageServiceTest {

    private final ResumeFileRepository repository = mock(ResumeFileRepository.class);
    private final ResumeStorageService service = new ResumeStorageService(repository);

    private static final byte[] PDF = "%PDF-1.4 fake".getBytes();

    @Test
    void save_validPdf_storesBytesAndReturnsPdfName() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", PDF);

        String name = service.save(file);

        ArgumentCaptor<ResumeFile> captor = ArgumentCaptor.forClass(ResumeFile.class);
        verify(repository).save(captor.capture());
        assertTrue(name.endsWith(".pdf"));
        assertEquals(name, captor.getValue().getId());
        assertArrayEquals(PDF, captor.getValue().getData());
    }

    @Test
    void save_wrongExtension_isRejected() {
        MockMultipartFile file = new MockMultipartFile("file", "cv.txt", "text/plain", PDF);

        assertThrows(IllegalArgumentException.class, () -> service.save(file));
        verify(repository, never()).save(any());
    }

    @Test
    void save_pdfExtensionButNotPdfContent_isRejected() {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "hello".getBytes());

        assertThrows(IllegalArgumentException.class, () -> service.save(file));
        verify(repository, never()).save(any());
    }

    @Test
    void load_existing_returnsBytes() {
        ResumeFile entity = new ResumeFile();
        entity.setData(PDF);
        when(repository.findById("abc-123.pdf")).thenReturn(Optional.of(entity));

        assertArrayEquals(PDF, service.load("abc-123.pdf").orElseThrow());
    }

    @Test
    void load_pathTraversalName_isRejectedWithoutTouchingRepository() {
        assertTrue(service.load("../../etc/passwd").isEmpty());
        verify(repository, never()).findById(any());
    }
}
