package com.myfave.api.domain.content.service;

import com.myfave.api.domain.content.repository.ShortFormRepository;
import com.myfave.api.domain.content.repository.StyleFeedRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 조회수 write-back DB 반영 — 누적 증분들을 한 트랜잭션으로 DB에 더함
 * 스케줄러와 분리한 이유: "DB 커밋 성공 후 Redis 차감" 순서를 보장하기 위함
 * (이 메서드가 정상 반환=커밋 완료 후에야 스케줄러가 Redis를 차감)
 */
@Service
@RequiredArgsConstructor
public class ContentViewWriteBackService {

    private final ShortFormRepository shortFormRepository;
    private final StyleFeedRepository styleFeedRepository;

    @Transactional
    public void applyAll(List<ContentViewDelta> deltas) {
        for (ContentViewDelta d : deltas) {
            switch (d.type()) {
                case SHORT_FORM -> shortFormRepository.addViewCount(d.id(), d.delta());
                case STYLE_FEED -> styleFeedRepository.addViewCount(d.id(), d.delta());
            }
        }
    }
}
