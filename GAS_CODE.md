# Google Apps Script 設定說明

## 第一步：建立 Google Sheets

建立一份新的 Google Sheets，包含以下兩個工作表：

### 工作表 1：`班級`
| A | B |
|---|---|
| 班級 | 小隊數 |
| 和班 | 9 |
| 平班 | 8 |

### 工作表 2：`加分`
第一行（標題行）：
| A | B | C | D |
|---|---|---|---|
| 時間 | 班級 | 小隊 | 分數 |

---

## 第二步：建立 Apps Script

在 Google Sheets 上方選單：**擴充功能 → Apps Script**

貼上以下程式碼（完整取代原有內容）：

```javascript
function doGet(e) {
  const action = e.parameter.action;

  if (action === 'addScore') {
    return addScore(e.parameter);
  }

  return getScores();
}

// 寫入一筆加分記錄
function addScore(params) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('加分');

  const 班級 = params['班級'] || '';
  const 小隊 = params['小隊'] || '';
  const 分數 = parseInt(params['分數']) || 2;

  if (!班級 || !小隊) {
    return buildResponse({ success: false, error: '缺少班級或小隊參數' });
  }

  sheet.appendRow([new Date(), 班級, 小隊, 分數]);

  return buildResponse({ success: true, message: `${班級} 第${小隊}小隊 +${分數}分` });
}

// 取得所有小隊分數（由高到低排列）
function getScores() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('加分');
  const data = sheet.getDataRange().getValues();

  const scores = {};

  // 跳過標題行（第 0 行）
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row[1] || !row[2]) continue;
    const key = `${row[1]}|||${row[2]}`;
    scores[key] = (scores[key] || 0) + (parseInt(row[3]) || 0);
  }

  const result = Object.entries(scores)
    .map(([key, total]) => {
      const [班級, 小隊] = key.split('|||');
      return { 班級, 小隊, 總分: total };
    })
    .sort((a, b) => b.總分 - a.總分);

  return buildResponse(result);
}

function buildResponse(data) {
  const output = ContentService.createTextOutput(JSON.stringify(data));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
```

---

## 第三步：部署 Web App

1. 右上角點 **「部署」→「新增部署作業」**
2. 選擇類型：**網頁應用程式**
3. 設定：
   - 以下列身分執行：**我（你的帳號）**
   - 誰可以存取：**所有人**
4. 點 **「部署」**
5. 複製產生的 **網頁應用程式 URL**

---

## 第四步：填入 .env

打開 `fushing/.env`，貼上 URL：

```
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/xxxxxx/exec
```

存檔後重新跑 `npm run dev` 即可生效。

---

## API 說明

| 請求 | 說明 |
|------|------|
| `?action=getScores` | 取得所有小隊總分（JSON 陣列） |
| `?action=addScore&班級=和班&小隊=3&分數=2` | 新增一筆 +2 分記錄 |

> **注意**：前端使用 GET 請求避免 CORS preflight 問題，GAS Web App 的 doGet 天然支援跨域存取。
