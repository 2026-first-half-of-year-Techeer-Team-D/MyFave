package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.myfave.api.domain.content.dto.response.StyleFeedResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ContentService {

    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;

    // 9-2. 스타일 피드 목록 조회
    public Page<StyleFeedResponse> getStyleFeeds(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "styleFeedId"));
        return styleFeedRepository.findAll(pageable)
                .map(StyleFeedResponse::from);
    }
}
