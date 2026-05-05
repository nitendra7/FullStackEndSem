package com.cms.service;

import com.cms.dto.CommentRequest;
import com.cms.dto.CommentResponse;
import com.cms.dto.ComplaintRequest;
import com.cms.dto.ComplaintResponse;
import com.cms.entity.*;
import com.cms.enums.Role;
import com.cms.enums.Status;
import com.cms.exception.ResourceNotFoundException;
import com.cms.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;

    public ComplaintService(ComplaintRepository complaintRepository, CategoryRepository categoryRepository, UserRepository userRepository, CommentRepository commentRepository) {
        this.complaintRepository = complaintRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.commentRepository = commentRepository;
    }

    public ComplaintResponse createComplaint(ComplaintRequest request, Long userId) {
        User complainant = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setDescription(request.getDescription());
        complaint.setCategory(category);
        complaint.setPriority(request.getPriority());
        complaint.setComplainant(complainant);
        complaint.setStatus(Status.NEW);
        complaint.setAttachmentUrl(request.getAttachmentUrl());

        Complaint saved = complaintRepository.save(complaint);
        return mapToResponse(saved);
    }

    public List<ComplaintResponse> getMyComplaints(Long userId) {
        return complaintRepository.findByComplainantId(userId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAssignedComplaints(Long agentId) {
        return complaintRepository.findByAgentId(agentId)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAll()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    public ComplaintResponse updateStatus(Long complaintId, Status status) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        complaint.setStatus(status);
        return mapToResponse(complaintRepository.save(complaint));
    }

    public ComplaintResponse assignComplaint(Long complaintId, Long agentId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User agent = userRepository.findById(agentId)
                .orElseThrow(() -> new ResourceNotFoundException("Agent not found"));

        if (agent.getRole() != Role.AGENT) {
            throw new RuntimeException("User is not an agent");
        }

        complaint.setAgent(agent);
        complaint.setStatus(Status.ASSIGNED);
        return mapToResponse(complaintRepository.save(complaint));
    }

    public void addComment(Long complaintId, CommentRequest request, Long userId) {
        Complaint complaint = complaintRepository.findById(complaintId)
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Comment comment = new Comment(request.getText(), complaint, user);
        commentRepository.save(comment);
    }

    public List<CommentResponse> getComments(Long complaintId) {
        return commentRepository.findByComplaintId(complaintId).stream()
                .map(comment -> {
                    CommentResponse res = new CommentResponse();
                    res.setId(comment.getId());
                    res.setText(comment.getText());
                    res.setUserName(comment.getUser().getName());
                    res.setCreatedAt(comment.getCreatedAt());
                    return res;
                }).collect(Collectors.toList());
    }

    private ComplaintResponse mapToResponse(Complaint c) {
        ComplaintResponse res = new ComplaintResponse();
        res.setId(c.getId());
        res.setTitle(c.getTitle());
        res.setDescription(c.getDescription());
        res.setStatus(c.getStatus());
        res.setPriority(c.getPriority());
        res.setCategoryName(c.getCategory().getName());
        res.setComplainantName(c.getComplainant().getName());
        res.setAgentName(c.getAgent() != null ? c.getAgent().getName() : "Unassigned");
        res.setAttachmentUrl(c.getAttachmentUrl());
        res.setCreatedAt(c.getCreatedAt());
        res.setUpdatedAt(c.getUpdatedAt());
        return res;
    }
}
