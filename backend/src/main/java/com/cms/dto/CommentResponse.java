package com.cms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private Long id;
    private String text;
    private String userName;
    private LocalDateTime createdAt;
}
