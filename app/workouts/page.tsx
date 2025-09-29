export default function WorkoutsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">운동 기록</h1>
          <p className="text-gray-600">운동 세션을 기록하고 관리하세요</p>
        </div>

        {/* 새 운동 추가 버튼 */}
        <div className="mb-6">
          <button className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium">
            + 새 운동 추가
          </button>
        </div>

        {/* 운동 목록 */}
        <div className="space-y-4">
          {/* 예시 운동 카드 */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">2024.09.29 - 가슴 운동</h3>
                <p className="text-gray-500 text-sm">45분</p>
              </div>
              <div className="flex gap-2">
                <button className="text-blue-600 hover:text-blue-800 text-sm">편집</button>
                <button className="text-red-600 hover:text-red-800 text-sm">삭제</button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm text-gray-700">
                <span className="font-medium">벤치프레스:</span> 80kg × 10회 (3세트)
              </div>
              <div className="text-sm text-gray-700">
                <span className="font-medium">인클라인 벤치프레스:</span> 60kg × 12회 (3세트)
              </div>
            </div>
          </div>

          {/* 빈 상태 메시지 */}
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">아직 운동 기록이 없습니다</p>
            <p className="text-sm">첫 운동을 기록해보세요!</p>
          </div>
        </div>
      </div>
    </div>
  );
}