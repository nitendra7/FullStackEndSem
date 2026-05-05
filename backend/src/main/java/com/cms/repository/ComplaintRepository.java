package com.cms.repository;

import com.cms.entity.Complaint;
import com.cms.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByComplainantId(Long complainantId);
    List<Complaint> findByAgentId(Long agentId);
    List<Complaint> findByStatus(Status status);
    List<Complaint> findByCategoryId(Long categoryId);
}
