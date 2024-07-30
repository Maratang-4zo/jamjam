package com.maratang.jamjam.domain.chat.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.maratang.jamjam.domain.chat.entity.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
}
