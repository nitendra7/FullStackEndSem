package com.cms.dto;

import com.cms.enums.Priority;
import com.cms.enums.Status;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ComplaintResponse {
    private Long id;
    private String title;
    private String description;
    private Status status;
    private Priority priority;
    private String categoryName;
    private String complainantName;
    private String agentName;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
