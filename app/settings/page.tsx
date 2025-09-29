export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">설정</h1>
          <p className="text-gray-600">앱 설정을 관리하세요</p>
        </div>

        {/* 프로필 설정 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">프로필</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="이름을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="이메일을 입력하세요"
              />
            </div>
          </div>
        </div>

        {/* 운동 설정 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">운동 설정</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">기본 중량 단위</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                <option value="kg">킬로그램 (kg)</option>
                <option value="lb">파운드 (lb)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">휴식 시간 알림</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black">
                <option value="off">사용 안함</option>
                <option value="60">1분</option>
                <option value="90">1분 30초</option>
                <option value="120">2분</option>
                <option value="180">3분</option>
              </select>
            </div>
          </div>
        </div>

        {/* 데이터 관리 */}
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">데이터 관리</h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
              데이터 내보내기
            </button>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
              데이터 백업
            </button>
            <button className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
              모든 데이터 삭제
            </button>
          </div>
        </div>

        {/* 저장 버튼 */}
        <button className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-800 transition-colors font-medium">
          설정 저장
        </button>
      </div>
    </div>
  );
}