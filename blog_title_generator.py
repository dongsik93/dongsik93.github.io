import requests
import re  # 정규표현식 (문자열 패턴 찾기)
import urllib.parse
import time

# ==========================================
# [설정 영역] 사용자 정보 입력
# ==========================================
NAVER_ID = "econ_view"  # 👈 본인 아이디 확인!
# ==========================================

def get_naver_blog_titles_robust(blog_id):
    page = 1
    total_titles = []
    
    print(f"🚀 네이버 블로그 [{blog_id}] 제목 수집을 시작합니다... (무적 모드)")

    while True:
        # ✅ countPerPage를 50으로 변경
        url = (
            f"https://blog.naver.com/PostTitleListAsync.naver"
            f"?blogId={blog_id}&viewdate=&currentPage={page}"
            f"&categoryNo=&parentCategoryNo=&countPerPage=50"
        )
        
        try:
            headers = {
                'User-Agent': (
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) '
                    'AppleWebKit/537.36 (KHTML, like Gecko) '
                    'Chrome/91.0.4472.124 Safari/537.36'
                )
            }
            response = requests.get(url, headers=headers)
            
            # JSON 파싱 대신 정규표현식으로 title만 추출
            raw_titles = re.findall(r'"title":"(.*?)"', response.text)
            
            if not raw_titles:
                print(f"✅ 수집 종료! (총 {len(total_titles)}개 발견)")
                break
                
            print(f"📄 {page}페이지 수집 중... ({len(raw_titles)}개 발견)")
            
            for raw_t in raw_titles:
                try:
                    clean_title = urllib.parse.unquote(raw_t).replace('+', ' ')
                    clean_title = (
                        clean_title
                        .replace('&lt;', '<')
                        .replace('&gt;', '>')
                        .replace('&amp;', '&')
                        .replace('&quot;', '"')
                    )
                    total_titles.append(clean_title)
                except:
                    continue
            
            page += 1
            time.sleep(0.3)  # 매너 딜레이

        except Exception as e:
            print(f"❌ 예상치 못한 에러: {e}")
            break

    return total_titles

# [실행 및 저장]
if __name__ == "__main__":
    all_titles = get_naver_blog_titles_robust(NAVER_ID)
    
    print("-" * 30)
    
    filename = "naver_blog_titles_fixed.txt"
    with open(filename, "w", encoding="utf-8") as f:
        for idx, t in enumerate(all_titles, 1):
            f.write(f"{t}\n")
            if idx <= 5:
                print(f"{idx}. {t}")
    
    if len(all_titles) > 5:
        print("... (중략) ...")
        
    print("-" * 30)
    print(f"💾 '{filename}' 파일에 저장 완료! 이번엔 성공했을 겁니다. 😉")

