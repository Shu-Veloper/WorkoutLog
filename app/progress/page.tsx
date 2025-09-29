export default function ProgressPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">운동 통계</h1>
          <p className="text-gray-600">운동 진행상황과 개인 기록을 확인하세요</p>
        </div>

        {/* 통계 카드들 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">이번 달 운동</h3>
            <p className="text-3xl font-bold text-black">12회</p>
            <p className="text-green-600 text-sm">+3회 (전월 대비)</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">총 운동 시간</h3>
            <p className="text-3xl font-bold text-black">18시간</p>
            <p className="text-gray-500 text-sm">평균 90분/회</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">연속 운동</h3>
            <p className="text-3xl font-bold text-black">5일</p>
            <p className="text-blue-600 text-sm">새 기록!</p>
          </div>
        </div>

        {/* 개인 기록 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">개인 기록 (1RM)</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">벤치프레스</span>
              <div className="text-right">
                <span className="text-lg font-bold text-black">80kg</span>
                <p className="text-green-600 text-sm">+5kg (이번 달)</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">스쿼트</span>
              <div className="text-right">
                <span className="text-lg font-bold text-black">100kg</span>
                <p className="text-green-600 text-sm">+10kg (이번 달)</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">데드리프트</span>
              <div className="text-right">
                <span className="text-lg font-bold text-black">120kg</span>
                <p className="text-gray-500 text-sm">변화 없음</p>
              </div>
            </div>
          </div>
        </div>

        {/* 차트 영역 (추후 구현) */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">운동 빈도 차트</h2>
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">차트가 곧 추가될 예정입니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}