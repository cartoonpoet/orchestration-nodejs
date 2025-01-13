export function koreanToNumber(korean) {
    const units = {
      일: 1,
      이: 2,
      삼: 3,
      사: 4,
      오: 5,
      육: 6,
      칠: 7,
      팔: 8,
      구: 9,
      십: 10,
      백: 100,
      천: 1000,
      만: 10000,
      억: 100000000,
      조: 1000000000000,
    };
  
    // "원", "만 원", "억 원" 등을 제거
    korean = korean.replace(/(원|만|억)/g, '');
  
    let result = 0; // 최종 결과 값
    let temp = 0; // 단위 이하 값을 임시 저장
    let currentUnit = 1; // 현재 단위(만, 억 등)
  
    for (const char of korean) {
      if (units[char]) {
        if (units[char] >= 10) {
          // "십", "백", "천" 등 단위 처리
          temp = temp === 0 ? 1 : temp; // 단위 앞에 숫자가 없으면 1로 간주
          temp *= units[char];
        } else {
          // "일", "이", "삼" 등 숫자 처리
          temp += units[char];
        }
      } else {
        // 큰 단위(만, 억 등) 처리
        result += temp * currentUnit;
        temp = 0; // 단위 처리 후 초기화
        currentUnit = units[char] || 1; // 현재 단위를 업데이트
      }
    }
  
    return result + temp * currentUnit; // 남아 있는 값 더하기
  }
  