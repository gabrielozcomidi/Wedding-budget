import React, { useState, useEffect } from 'react';
import './App.css';

// קטגוריות הוצאות נפוצות בחתונות - הועבר מחוץ לקומפוננטה כדי לפתור את הבעיה
const defaultCategories = [
  { id: 1, name: "אולם/גן אירועים" },
  { id: 2, name: "קייטרינג" },
  { id: 3, name: "מוזיקה/די-ג'יי/להקה" },
  { id: 4, name: "צילום/וידאו" },
  { id: 5, name: "שמלת כלה" },
  { id: 6, name: "חליפת חתן" },
  { id: 7, name: "פרחים ועיצוב" },
  { id: 8, name: "הזמנות" },
  { id: 9, name: "טבעות" },
  { id: 10, name: "איפור ושיער" },
  { id: 11, name: "הסעות" },
  { id: 12, name: "לינה" },
  { id: 13, name: "ירח דבש" },
  { id: 14, name: "מפיק/ת אירוע" },
  { id: 15, name: "מתנות לצוות החתונה" },
  { id: 16, name: "עוגה/קינוחים" },
  { id: 17, name: "רב/עורך טקס" },
  { id: 18, name: "רישום נישואין" },
  { id: 19, name: "ארוחת חזרה" },
  { id: 20, name: "אירועים לפני החתונה (מסיבת רווקים/ות)" },
  { id: 21, name: "הוצאות שונות" }
];

// אייקונים פשוטים ב-SVG עבור הלחצנים
const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
);

const PlusCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
);

// המערכת המלאה לניהול תקציב חתונה
function App() {
  // משתנים לשמירת הנתונים
  const [categories, setCategories] = useState(defaultCategories);
  const [expenses, setExpenses] = useState([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [gifts, setGifts] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    description: "",
    plannedAmount: "",
    actualAmount: "",
    advancePayment: "",
    dueDate: "",
    isPaid: false
  });
  const [newGift, setNewGift] = useState({
    from: "",
    amount: "",
    type: "כסף", // ברירת מחדל: כסף או מתנה
    receivedDate: ""
  });
  const [newCategory, setNewCategory] = useState("");
  const [activeTab, setActiveTab] = useState("expenses");
  const [editingExpense, setEditingExpense] = useState(null);
  const [editingGift, setEditingGift] = useState(null);
  const [jsonFile, setJsonFile] = useState(null);

  // חישוב סכומים
  const totalPlanned = expenses.reduce((sum, expense) => sum + (parseFloat(expense.plannedAmount) || 0), 0);
  const totalActual = expenses.reduce((sum, expense) => sum + (parseFloat(expense.actualAmount) || 0), 0);
  const totalAdvance = expenses.reduce((sum, expense) => sum + (parseFloat(expense.advancePayment) || 0), 0);
  const totalGifts = gifts.reduce((sum, gift) => sum + (parseFloat(gift.amount) || 0), 0);
  const balance = totalGifts - totalActual;

  // הוספת או עדכון הוצאה
  const addExpense = () => {
    if (newExpense.category && (newExpense.plannedAmount || newExpense.actualAmount)) {
      if (editingExpense) {
        // עדכון הוצאה קיימת
        setExpenses(expenses.map(expense => 
          expense.id === editingExpense ? {
            ...newExpense,
            id: editingExpense,
            plannedAmount: parseFloat(newExpense.plannedAmount) || 0,
            actualAmount: parseFloat(newExpense.actualAmount) || 0,
            advancePayment: parseFloat(newExpense.advancePayment) || 0
          } : expense
        ));
        setEditingExpense(null);
      } else {
        // הוספת הוצאה חדשה
        setExpenses([...expenses, { 
          ...newExpense, 
          id: Date.now(), 
          plannedAmount: parseFloat(newExpense.plannedAmount) || 0,
          actualAmount: parseFloat(newExpense.actualAmount) || 0,
          advancePayment: parseFloat(newExpense.advancePayment) || 0
        }]);
      }
      
      // איפוס הטופס
      setNewExpense({
        category: "",
        description: "",
        plannedAmount: "",
        actualAmount: "",
        advancePayment: "",
        dueDate: "",
        isPaid: false
      });
    }
  };
  
  // התחלת עריכת הוצאה
  const startEditExpense = (expense) => {
    setEditingExpense(expense.id);
    setNewExpense({
      category: expense.category,
      description: expense.description,
      plannedAmount: expense.plannedAmount,
      actualAmount: expense.actualAmount,
      advancePayment: expense.advancePayment,
      dueDate: expense.dueDate,
      isPaid: expense.isPaid
    });
    // גלילה אל טופס העריכה
    window.scrollTo(0, 0);
  };
  
  // ביטול עריכה
  const cancelEdit = () => {
    setEditingExpense(null);
    setNewExpense({
      category: "",
      description: "",
      plannedAmount: "",
      actualAmount: "",
      advancePayment: "",
      dueDate: "",
      isPaid: false
    });
  };

  // מחיקת הוצאה
  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  // עדכון סטטוס תשלום
  const togglePaid = (id) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, isPaid: !expense.isPaid } : expense
    ));
  };

  // הוספת קטגוריה חדשה
  const addCategory = () => {
    if (newCategory) {
      setCategories([...categories, { id: Date.now(), name: newCategory }]);
      setNewCategory("");
    }
  };

  // הוספת או עדכון מתנה
  const addGift = () => {
    if (newGift.from && newGift.amount) {
      if (editingGift) {
        // עדכון מתנה קיימת
        setGifts(gifts.map(gift => 
          gift.id === editingGift ? {
            ...newGift,
            id: editingGift,
            amount: parseFloat(newGift.amount) || 0
          } : gift
        ));
        setEditingGift(null);
      } else {
        // הוספת מתנה חדשה
        setGifts([...gifts, { 
          ...newGift, 
          id: Date.now(), 
          amount: parseFloat(newGift.amount) || 0 
        }]);
      }
      
      // איפוס הטופס
      setNewGift({
        from: "",
        amount: "",
        type: "כסף",
        receivedDate: ""
      });
    }
  };
  
  // התחלת עריכת מתנה
  const startEditGift = (gift) => {
    setEditingGift(gift.id);
    setNewGift({
      from: gift.from,
      amount: gift.amount,
      type: gift.type,
      receivedDate: gift.receivedDate
    });
    // גלילה אל טופס העריכה
    window.scrollTo(0, 0);
  };
  
  // ביטול עריכת מתנה
  const cancelEditGift = () => {
    setEditingGift(null);
    setNewGift({
      from: "",
      amount: "",
      type: "כסף",
      receivedDate: ""
    });
  };

  // מחיקת מתנה
  const deleteGift = (id) => {
    setGifts(gifts.filter(gift => gift.id !== id));
  };

  // עריכת התקציב הכללי
  const handleBudgetChange = (e) => {
    setTotalBudget(parseFloat(e.target.value) || 0);
  };

  // ייצוא נתונים לקובץ CSV
  const exportToCSV = (dataType) => {
    let csvContent = "";
    let filename = "";
    
    // הכנת נתונים לפי סוג המידע
    if (dataType === "expenses") {
      // כותרות
      csvContent = "קטגוריה,תיאור,סכום מתוכנן,סכום בפועל,מקדמה,תאריך יעד,שולם\n";
      
      // שורות נתונים
      expenses.forEach(expense => {
        const row = [
          `"${expense.category}"`,
          `"${expense.description}"`,
          expense.plannedAmount,
          expense.actualAmount,
          expense.advancePayment,
          expense.dueDate,
          expense.isPaid ? "כן" : "לא"
        ];
        csvContent += row.join(",") + "\n";
      });
      
      filename = "הוצאות_חתונה.csv";
    } 
    else if (dataType === "gifts") {
      // כותרות
      csvContent = "מאת,סכום,סוג,תאריך קבלה\n";
      
      // שורות נתונים
      gifts.forEach(gift => {
        const row = [
          `"${gift.from}"`,
          gift.amount,
          `"${gift.type}"`,
          gift.receivedDate
        ];
        csvContent += row.join(",") + "\n";
      });
      
      filename = "מתנות_חתונה.csv";
    }
    else if (dataType === "all") {
      // מייצא את כל הנתונים - הוצאות, מתנות וסיכום
      
      // חלק ראשון - הוצאות
      csvContent = "הוצאות חתונה\n\n";
      csvContent += "קטגוריה,תיאור,סכום מתוכנן,סכום בפועל,מקדמה,תאריך יעד,שולם\n";
      
      expenses.forEach(expense => {
        const row = [
          `"${expense.category}"`,
          `"${expense.description}"`,
          expense.plannedAmount,
          expense.actualAmount,
          expense.advancePayment,
          expense.dueDate,
          expense.isPaid ? "כן" : "לא"
        ];
        csvContent += row.join(",") + "\n";
      });
      
      // חלק שני - מתנות
      csvContent += "\nמתנות חתונה\n\n";
      csvContent += "מאת,סכום,סוג,תאריך קבלה\n";
      
      gifts.forEach(gift => {
        const row = [
          `"${gift.from}"`,
          gift.amount,
          `"${gift.type}"`,
          gift.receivedDate
        ];
        csvContent += row.join(",") + "\n";
      });
      
      // חלק שלישי - סיכום
      csvContent += "\nסיכום\n\n";
      csvContent += "תיאור,סכום\n";
      csvContent += `"תקציב כולל",${totalBudget}\n`;
      csvContent += `"סך הכל מתוכנן",${totalPlanned}\n`;
      csvContent += `"סך הכל בפועל",${totalActual}\n`;
      csvContent += `"מקדמות ששולמו",${totalAdvance}\n`;
      csvContent += `"יתרה לתשלום",${totalActual - totalAdvance}\n`;
      csvContent += `"סך הכל מתנות",${totalGifts}\n`;
      csvContent += `"מאזן סופי",${balance}\n`;
      
      filename = "נתוני_חתונה_מלאים.csv";
    }
    
    // הוספת BOM לתמיכה בעברית
    const BOM = "\uFEFF";
    csvContent = BOM + csvContent;
    
    // יצירת קובץ והורדה
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // ייצוא נתונים לקובץ JSON
  const exportToJSON = () => {
    const dataToExport = {
      categories,
      expenses,
      totalBudget,
      gifts,
      summary: {
        totalPlanned,
        totalActual,
        totalAdvance,
        totalGifts,
        balance,
      }
    };
    
    const jsonContent = JSON.stringify(dataToExport, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "נתוני_חתונה.json");
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ייבוא נתונים מקובץ JSON
  const handleFileChange = (e) => {
    setJsonFile(e.target.files[0]);
  };

  const importFromJSON = () => {
    if (!jsonFile) {
      alert("אנא בחר קובץ JSON לייבוא");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // וידוא שהקובץ מכיל את הנתונים הדרושים
        if (data.categories && data.expenses && data.gifts) {
          setCategories(data.categories);
          setExpenses(data.expenses);
          setGifts(data.gifts);
          setTotalBudget(data.totalBudget || 0);
          
          saveData(data);
          alert("הנתונים יובאו בהצלחה!");
          setJsonFile(null);
          
          // איפוס שדה הקובץ
          const fileInput = document.getElementById('jsonFileInput');
          if (fileInput) fileInput.value = '';
        } else {
          alert("הקובץ אינו מכיל את כל הנתונים הדרושים");
        }
      } catch (error) {
        alert("שגיאה בקריאת הקובץ: " + error.message);
      }
    };
    reader.readAsText(jsonFile);
  };

  // שמירת נתונים במקומי
  useEffect(() => {
    const savedData = localStorage.getItem('weddingBudgetData');
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        setCategories(data.categories || defaultCategories);
        setExpenses(data.expenses || []);
        setTotalBudget(data.totalBudget || 0);
        setGifts(data.gifts || []);
      } catch (e) {
        console.error("שגיאה בטעינת הנתונים:", e);
      }
    }
  }, []); // כיוון ש-defaultCategories מוגדר מחוץ לקומפוננטה, אין צורך לכלול אותו במערך התלויות

  const saveData = (customData = null) => {
    const dataToSave = customData || {
      categories,
      expenses,
      totalBudget,
      gifts
    };
    localStorage.setItem('weddingBudgetData', JSON.stringify(dataToSave));
    if (!customData) {
      alert("הנתונים נשמרו בהצלחה!");
    }
  };

  return (
    <div className="font-sans rtl text-right bg-gray-50 p-4 h-full">
      <h1 className="text-3xl font-bold mb-6 text-center text-purple-800">מערכת ניהול תקציב החתונה שלנו</h1>
      
      {/* כרטיסיות */}
      <div className="flex mb-6 border-b overflow-x-auto">
        <button 
          className={`px-4 py-2 ${activeTab === 'expenses' ? 'bg-purple-100 border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setActiveTab('expenses')}
        >
          הוצאות ותקציב
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'gifts' ? 'bg-purple-100 border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setActiveTab('gifts')}
        >
          מתנות והכנסות
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'summary' ? 'bg-purple-100 border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          סיכום
        </button>
        <button 
          className={`px-4 py-2 ${activeTab === 'export' ? 'bg-purple-100 border-b-2 border-purple-600 font-bold' : ''}`}
          onClick={() => setActiveTab('export')}
        >
          ייצוא/ייבוא
        </button>
      </div>

      {/* לוח בקרה עליון */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2 text-purple-600">סך הכל מתוכנן</h3>
          <p className="text-2xl font-bold">₪{totalPlanned.toLocaleString()}</p>
          {totalBudget > 0 && (
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full ${totalPlanned > totalBudget ? 'bg-red-600' : 'bg-green-600'}`}
                  style={{ width: `${Math.min(100, (totalPlanned / totalBudget) * 100)}%` }}
                ></div>
              </div>
              <p className="text-sm mt-1">{((totalPlanned / totalBudget) * 100).toFixed(1)}% מהתקציב</p>
            </div>
          )}
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2 text-purple-600">סך הכל בפועל</h3>
          <p className="text-2xl font-bold">₪{totalActual.toLocaleString()}</p>
          <p className="text-sm">מקדמות ששולמו: ₪{totalAdvance.toLocaleString()}</p>
          <p className="text-sm">יתרה לתשלום: ₪{(totalActual - totalAdvance).toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-bold mb-2 text-purple-600">תקציב כולל</h3>
          <div className="flex items-center">
            <input 
              type="number" 
              value={totalBudget}
              onChange={handleBudgetChange}
              className="border rounded p-2 w-full text-xl"
              placeholder="הכנס תקציב כולל"
            />
            <span className="mr-2 text-xl">₪</span>
          </div>
        </div>
      </div>

      {/* תוכן כרטיסיות */}
      {activeTab === 'expenses' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-purple-800">
              {editingExpense ? "עריכת הוצאה" : "הוספת הוצאה חדשה"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1">קטגוריה</label>
                <select 
                  className="border rounded p-2 w-full"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
                  <option value="">בחר קטגוריה</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block mb-1">תיאור</label>
                <input 
                  type="text" 
                  className="border rounded p-2 w-full"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  placeholder="תיאור ההוצאה"
                />
              </div>
              <div>
                <label className="block mb-1">סכום מתוכנן</label>
                <input 
                  type="number" 
                  className="border rounded p-2 w-full"
                  value={newExpense.plannedAmount}
                  onChange={(e) => setNewExpense({...newExpense, plannedAmount: e.target.value})}
                  placeholder="סכום בש״ח"
                />
              </div>
              <div>
                <label className="block mb-1">סכום בפועל</label>
                <input 
                  type="number" 
                  className="border rounded p-2 w-full"
                  value={newExpense.actualAmount}
                  onChange={(e) => setNewExpense({...newExpense, actualAmount: e.target.value})}
                  placeholder="סכום בש״ח"
                />
              </div>
              <div>
                <label className="block mb-1">מקדמה ששולמה</label>
                <input 
                  type="number" 
                  className="border rounded p-2 w-full"
                  value={newExpense.advancePayment}
                  onChange={(e) => setNewExpense({...newExpense, advancePayment: e.target.value})}
                  placeholder="סכום בש״ח"
                />
              </div>
              <div>
                <label className="block mb-1">תאריך יעד לתשלום</label>
                <input 
                  type="date" 
                  className="border rounded p-2 w-full"
                  value={newExpense.dueDate}
                  onChange={(e) => setNewExpense({...newExpense, dueDate: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-4 flex">
              <button 
                onClick={addExpense}
                className="bg-purple-600 text-white px-4 py-2 rounded flex items-center hover:bg-purple-700"
              >
                {editingExpense ? "שמור שינויים" : <><PlusCircleIcon /> הוסף הוצאה</>}
              </button>
              
              {editingExpense && (
                <button 
                  onClick={cancelEdit}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  בטל עריכה
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-purple-800">הוספת קטגוריה חדשה</h2>
            <div className="flex">
              <input 
                type="text" 
                className="border rounded p-2 flex-grow"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="שם הקטגוריה החדשה"
              />
              <button 
                onClick={addCategory}
                className="bg-purple-600 text-white px-4 py-2 rounded mr-2 flex items-center hover:bg-purple-700"
              >
                <PlusCircleIcon />
                הוסף
              </button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-purple-800">רשימת הוצאות</h2>
            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="border p-2 text-right">קטגוריה</th>
                      <th className="border p-2 text-right">תיאור</th>
                      <th className="border p-2 text-right">סכום מתוכנן</th>
                      <th className="border p-2 text-right">סכום בפועל</th>
                      <th className="border p-2 text-right">מקדמה</th>
                      <th className="border p-2 text-right">תאריך יעד</th>
                      <th className="border p-2 text-center">שולם</th>
                      <th className="border p-2 text-center">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(expense => (
                      <tr key={expense.id} className={expense.isPaid ? "bg-green-50" : ""}>
                        <td className="border p-2">{expense.category}</td>
                        <td className="border p-2">{expense.description}</td>
                        <td className="border p-2">₪{parseFloat(expense.plannedAmount).toLocaleString()}</td>
                        <td className="border p-2">₪{parseFloat(expense.actualAmount).toLocaleString()}</td>
                        <td className="border p-2">₪{parseFloat(expense.advancePayment).toLocaleString()}</td>
                        <td className="border p-2">{expense.dueDate}</td>
                        <td className="border p-2 text-center">
                          <input 
                            type="checkbox" 
                            checked={expense.isPaid}
                            onChange={() => togglePaid(expense.id)}
                            className="w-4 h-4"
                          />
                        </td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => startEditExpense(expense)}
                              className="text-blue-600 hover:text-blue-800 ml-2"
                              title="ערוך"
                            >
                              <EditIcon />
                            </button>
                            <button 
                              onClick={() => deleteExpense(expense.id)}
                              className="text-red-600 hover:text-red-800"
                              title="מחק"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">אין הוצאות עדיין. הוסף את ההוצאה הראשונה בטופס למעלה.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'gifts' && (
        <div>
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4 text-purple-800">
              {editingGift ? "עריכת מתנה/הכנסה" : "הוספת מתנה/הכנסה"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block mb-1">מאת</label>
                <input 
                  type="text" 
                  className="border rounded p-2 w-full"
                  value={newGift.from}
                  onChange={(e) => setNewGift({...newGift, from: e.target.value})}
                  placeholder="שם האורח/ים"
                />
              </div>
              <div>
                <label className="block mb-1">סכום</label>
                <input 
                  type="number" 
                  className="border rounded p-2 w-full"
                  value={newGift.amount}
                  onChange={(e) => setNewGift({...newGift, amount: e.target.value})}
                  placeholder="סכום בש״ח"
                />
              </div>
              <div>
                <label className="block mb-1">סוג</label>
                <select 
                  className="border rounded p-2 w-full"
                  value={newGift.type}
                  onChange={(e) => setNewGift({...newGift, type: e.target.value})}
                >
                  <option value="כסף">כסף</option>
                  <option value="שווה ערך">שווה ערך</option>
                  <option value="מתנה">מתנה</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">תאריך קבלה</label>
                <input 
                  type="date" 
                  className="border rounded p-2 w-full"
                  value={newGift.receivedDate}
                  onChange={(e) => setNewGift({...newGift, receivedDate: e.target.value})}
                />
              </div>
            </div>
            <div className="mt-4 flex">
              <button 
                onClick={addGift}
                className="bg-purple-600 text-white px-4 py-2 rounded flex items-center hover:bg-purple-700"
              >
                {editingGift ? "שמור שינויים" : <><PlusCircleIcon /> הוסף מתנה</>}
              </button>
              
              {editingGift && (
                <button 
                  onClick={cancelEditGift}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
                >
                  בטל עריכה
                </button>
              )}
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4 text-purple-800">רשימת מתנות והכנסות</h2>
            {gifts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-purple-100">
                      <th className="border p-2 text-right">מאת</th>
                      <th className="border p-2 text-right">סכום</th>
                      <th className="border p-2 text-right">סוג</th>
                      <th className="border p-2 text-right">תאריך קבלה</th>
                      <th className="border p-2 text-center">פעולות</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gifts.map(gift => (
                      <tr key={gift.id}>
                        <td className="border p-2">{gift.from}</td>
                        <td className="border p-2">₪{parseFloat(gift.amount).toLocaleString()}</td>
                        <td className="border p-2">{gift.type}</td>
                        <td className="border p-2">{gift.receivedDate}</td>
                        <td className="border p-2 text-center">
                          <div className="flex justify-center space-x-2">
                            <button 
                              onClick={() => startEditGift(gift)}
                              className="text-blue-600 hover:text-blue-800 ml-2"
                              title="ערוך"
                            >
                              <EditIcon />
                            </button>
                            <button 
                              onClick={() => deleteGift(gift.id)}
                              className="text-red-600 hover:text-red-800"
                              title="מחק"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500 italic">אין מתנות עדיין. תוכל להוסיף מתנות אחרי החתונה.</p>
            )}
            
            <div className="mt-6 p-4 bg-purple-50 rounded-lg">
              <h3 className="text-lg font-bold text-purple-800">סיכום מתנות</h3>
              <p className="text-2xl font-bold mt-2">₪{totalGifts.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'summary' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-purple-800">סיכום הוצאות והכנסות</h2>
              
              <div className="mb-4">
                <h3 className="font-bold text-gray-700">הוצאות</h3>
                <div className="flex justify-between border-b py-2">
                  <span>תקציב מתוכנן:</span>
                  <span className="font-bold">₪{totalBudget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>סך הכל מתוכנן:</span>
                  <span className="font-bold">₪{totalPlanned.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>סך הכל בפועל:</span>
                  <span className="font-bold">₪{totalActual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b py-2">
                  <span>מקדמות ששולמו:</span>
                  <span className="font-bold">₪{totalAdvance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span>יתרה לתשלום:</span>
                  <span className="font-bold">₪{(totalActual - totalAdvance).toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-bold text-gray-700">הכנסות</h3>
                <div className="flex justify-between py-2">
                  <span>סך הכל מתנות:</span>
                  <span className="font-bold">₪{totalGifts.toLocaleString()}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <h3 className="font-bold text-lg text-purple-800">מאזן סופי</h3>
                <div className="flex justify-between items-center mt-2">
                  <span>הכנסות פחות הוצאות:</span>
                  <span className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₪{balance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-4 text-purple-800">התפלגות הוצאות לפי קטגוריה</h2>
              
              {expenses.length > 0 ? (
                <div className="space-y-2">
                  {categories
                    .filter(cat => expenses.some(exp => exp.category === cat.name))
                    .map(cat => {
                      const categoryExpenses = expenses.filter(exp => exp.category === cat.name);
                      // הסרת המשתנה הלא משומש
                      const totalCategoryActual = categoryExpenses.reduce((sum, exp) => sum + (parseFloat(exp.actualAmount) || 0), 0);
                      const percentOfTotal = totalActual > 0 ? (totalCategoryActual / totalActual) * 100 : 0;
                      
                      return (
                        <div key={cat.id} className="border-b pb-2">
                          <div className="flex justify-between">
                            <span className="font-bold">{cat.name}</span>
                            <span>₪{totalCategoryActual.toLocaleString()} ({percentOfTotal.toFixed(1)}%)</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${percentOfTotal}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <p className="text-gray-500 italic">אין הוצאות עדיין. הוסף הוצאות כדי לראות את ההתפלגות.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'export' && (
        <div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-6 text-purple-800">ייצוא נתונים וייבוא</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-purple-800">ייצוא לקובץ CSV</h3>
                <p className="mb-4">קובץ CSV ניתן לפתיחה בתוכנות כמו Excel, Google Sheets או כל תוכנת גיליון אלקטרוני אחרת.</p>
                
                <div className="space-y-3">
                  <button 
                    onClick={() => exportToCSV("expenses")}
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-purple-700"
                  >
                    <DownloadIcon />
                    ייצוא טבלת הוצאות בלבד
                  </button>
                  
                  <button 
                    onClick={() => exportToCSV("gifts")}
                    className="bg-purple-600 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-purple-700"
                  >
                    <DownloadIcon />
                    ייצוא טבלת מתנות בלבד
                  </button>
                  
                  <button 
                    onClick={() => exportToCSV("all")}
                    className="bg-green-600 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-green-700"
                  >
                    <DownloadIcon />
                    ייצוא כל הנתונים (הוצאות, מתנות וסיכום)
                  </button>
                </div>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-4 text-blue-800">ייצוא וייבוא קובץ JSON</h3>
                <p className="mb-4">קובץ JSON שומר את כל המידע במדויק ויכול לשמש לגיבוי מלא של הנתונים או להעברה למערכת אחרת.</p>
                
                <button 
                  onClick={exportToJSON}
                  className="bg-blue-600 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-blue-700 mb-4"
                >
                  <DownloadIcon />
                  ייצוא כל הנתונים כקובץ JSON
                </button>

                <h4 className="font-bold mt-6 mb-2">ייבוא נתונים מקובץ JSON:</h4>
                <div className="border rounded p-4 bg-white">
                  <input
                    type="file"
                    id="jsonFileInput"
                    accept=".json"
                    onChange={handleFileChange}
                    className="w-full mb-3"
                  />
                  <button 
                    onClick={importFromJSON}
                    className="bg-green-600 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-green-700"
                  >
                    <UploadIcon />
                    ייבא נתונים מקובץ
                  </button>
                </div>
                
                <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                  <h4 className="font-bold mb-2">למה להשתמש ב-JSON?</h4>
                  <ul className="list-disc mr-4 space-y-1">
                    <li>שומר את המבנה המדויק של הנתונים</li>
                    <li>כולל את כל הקטגוריות המותאמות אישית</li>
                    <li>מאפשר לייבא את הנתונים בחזרה בקלות</li>
                    <li>אידיאלי לגיבוי מלא של המערכת</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-bold mb-2">שיתוף נתונים בין מכשירים:</h3>
              <ol className="list-decimal mr-6 space-y-1">
                <li>במכשיר אחד: ייצא את הנתונים כקובץ JSON</li>
                <li>שלח את הקובץ למכשיר השני (דרך מייל, וואטסאפ, וכו')</li>
                <li>במכשיר השני: היכנס ללשונית "ייצוא/ייבוא" ובחר "ייבא נתונים מקובץ"</li>
                <li>בחר את קובץ ה-JSON ששלחת ולחץ על כפתור "ייבא נתונים מקובץ"</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* כפתור שמירה וייצוא */}
      <div className="mt-6 flex justify-end">
        <button 
          onClick={saveData}
          className="bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center hover:bg-purple-800 ml-2"
        >
          <SaveIcon />
          שמור את כל הנתונים
        </button>
        
        <button 
          onClick={() => setActiveTab('export')}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center hover:bg-blue-700"
        >
          <DownloadIcon />
          ייצוא/ייבוא נתונים
        </button>
      </div>
    </div>
  );
}

export default App;
