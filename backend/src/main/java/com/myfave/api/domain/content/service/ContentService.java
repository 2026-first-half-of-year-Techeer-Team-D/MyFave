package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.myfave.api.domain.content.dto.response.ShortFormResponse;
import com.myfave.api.domain.content.entity.ShortFormType;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;

    // 9-1. 숏폼 목록 조회
    public List<ShortFormResponse> getShortForms(ShortFormType type, int size) {
        List<ShortFormResponse> shortForms;

        if (type != null) {
            shortForms = shortFormRepository.findByDisplayType(type).stream()
                    .map(ShortFormResponse::from)
                    .toList();
        } else {
            shortForms = shortFormRepository.findAll().stream()
                    .map(ShortFormResponse::from)
                    .toList();
        }

        if (shortForms.size() > size) {
            return shortForms.subList(0, size);
        }
        return shortForms;
    }
}
