export function koreanToNumber(korean) {
    const units = {
      만: 10000,
      억: 100000000,
      조: 1000000000000,
    };
  
    // "원" 및 뒤에 붙은 불필요한 텍스트 제거
    korean = korean.replace(/원.*/, '').replace(/\s+/g, '');
  
    let result = 0; // 최종 결과 값
    let temp = 0; // 단위 이하 값을 임시 저장
  
    // 정규식을 사용하여 숫자와 한글 단위를 추출
    const regex = /(\d+)([만억조]?)/g;
    let match;
  
    while ((match = regex.exec(korean)) !== null) {
      const number = parseInt(match[1], 10); // 숫자 부분
      const unit = match[2]; // 단위 부분
  
      if (unit) {
        // 단위가 있을 경우 곱해서 더하기
        result += number * (units[unit] || 1);
      } else {
        // 단위가 없으면 바로 더하기
        temp += number;
      }
    }
  
    return result + temp; // 남은 값 더하기
  }