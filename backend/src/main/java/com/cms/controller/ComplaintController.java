package com.cms.controller;

import com.cms.dto.CommentRequest;
import com.cms.dto.CommentResponse;
import com.cms.dto.ComplaintRequest;
import com.cms.dto.ComplaintResponse;
import com.cms.enums.Status;
import com.cms.security.UserDetailsImpl;
import com.cms.service.ComplaintService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/complaints")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ComplaintResponse> createComplaint(@RequestBody ComplaintRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(complaintService.createComplaint(request, userDetails.getId()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<ComplaintResponse>> getMyComplaints(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(complaintService.getMyComplaints(userDetails.getId()));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('AGENT')")
    public ResponseEntity<List<ComplaintResponse>> getAssignedComplaints(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return ResponseEntity.ok(complaintService.getAssignedComplaints(userDetails.getId()));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ComplaintResponse>> getAllComplaints() {
        return ResponseEntity.ok(complaintService.getAllComplaints());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('AGENT') or hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> updateStatus(@PathVariable Long id, @RequestParam Status status) {
        return ResponseEntity.ok(complaintService.updateStatus(id, status));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ComplaintResponse> assignComplaint(@PathVariable Long id, @RequestParam Long agentId) {
        return ResponseEntity.ok(complaintService.assignComplaint(id, agentId));
    }

    @PostMapping("/{id}/comments")
    public ResponseEntity<?> addComment(@PathVariable Long id, @RequestBody CommentRequest request, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        complaintService.addComment(id, request, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long id) {
        return ResponseEntity.ok(complaintService.getComments(id));
    }
}
