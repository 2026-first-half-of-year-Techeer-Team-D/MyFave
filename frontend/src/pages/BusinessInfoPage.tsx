export function BusinessInfoPage() {
  return (
    <div className="flex-1 bg-white pb-10">
      <div className="px-5 py-8">
        <table className="w-full font-noto text-sm">
          <tbody className="divide-y divide-separator/40">
            {[
              { label: '상호명', value: 'MY FAVE' },
              { label: '대표자', value: '(주)마이페이브' },
              { label: '사업자등록번호', value: '000-00-00000' },
              { label: '통신판매업신고번호', value: '제 0000-서울00-0000호' },
              { label: '주소', value: '서울특별시 00구 00로 000' },
              { label: '이메일', value: 'info@myfave.kr' },
              { label: '고객센터', value: '평일 11:00 ~ 18:00' },
            ].map(({ label, value }) => (
              <tr key={label}>
                <td className="w-[110px] py-3.5 font-medium text-muted-text">{label}</td>
                <td className="py-3.5 text-dark-text">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
