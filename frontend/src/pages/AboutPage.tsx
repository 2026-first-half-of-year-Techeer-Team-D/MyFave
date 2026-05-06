export function AboutPage() {
  return (
    <div className="flex-1">
      <div className="space-y-6 px-5 py-8">
        <section>
          <h2 className="mb-3 font-noto text-lg font-bold text-dark-text">MY FAVE에 대해</h2>
          <p className="font-noto text-sm leading-relaxed text-muted-text">
            MY FAVE는 인플루언서들이 직접 선택하고 추천하는 상품들을 만나볼 수 있는 특별한 쇼핑
            플랫폼입니다.
          </p>
        </section>

        <section>
          <h2 className="mb-3 font-noto text-lg font-bold text-dark-text">우리의 가치</h2>
          <ul className="space-y-2 font-noto text-sm leading-relaxed text-muted-text">
            <li>• 신뢰할 수 있는 인플루언서 추천</li>
            <li>• 품질이 우수한 상품 엄선</li>
            <li>• 고객 만족을 최우선</li>
            <li>• 투명한 거래 문화</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 font-noto text-lg font-bold text-dark-text">연락처</h2>
          <p className="font-noto text-sm text-muted-text">
            이메일: info@myfave.kr
            <br />
            전화: 02-1234-5678
          </p>
        </section>
      </div>
    </div>
  )
}
