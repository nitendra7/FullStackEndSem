package com.cms.dto;

import com.cms.enums.Priority;
import lombok.Data;

@Data
public class ComplaintRequest {
    private String title;
    private String description;
    private Long categoryId;
    private Priority priority;
    private String attachmentUrl;
}
