// تأثير بسيط باستخدام jQuery في كل الصفحات
$(document).ready(function () {
    $("main").hide().fadeIn(600);
});

// إظهار / إخفاء تفاصيل السيارة (jQuery)
function toggleDetails(id) {
    $("#details" + id).toggle();
}

// إظهار نموذج الطلب (jQuery)
function showForm() {
    $("#orderForm").slideDown();
}

function submitForm() {
    let national = $("#national").val().trim();
    let name = $("#name").val().trim();
    let mobile = $("#mobile").val().trim();
    let email = $("#email").val().trim();
    let startValue = $("#startDate").val();
    let endValue = $("#endDate").val();

    // الرقم الوطني: 11 خانة وأول خانتين من 01 إلى 14
    let nationalRegex = /^(0[1-9]|1[0-4])\d{9}$/;
    let nameRegex = /^[\u0600-\u06FF\s]+$/;
    // Syriatel: 093 / 098 / 099 ، MTN: 094 / 095 / 096
    let mobileRegex = /^09(3|4|5|6|8|9)\d{7}$/;
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nationalRegex.test(national)) {
        alert("الرقم الوطني غير صحيح (11 خانة، وأول خانتين من 01 إلى 14)");
        return;
    }
    if (name && !nameRegex.test(name)) {
        alert("الاسم يجب أن يكون باللغة العربية فقط");
        return;
    }
    if (!startValue || !endValue) {
        alert("تاريخ بداية ونهاية التأجير إلزاميان");
        return;
    }

    // التحقق من التسلسل الزمني
    let start = new Date(startValue);
    let end = new Date(endValue);
    if (end <= start) {
        alert("تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية");
        return;
    }

    if (mobile && !mobileRegex.test(mobile)) {
        alert("رقم الموبايل غير صحيح (يجب أن يطابق شبكتي Syriatel أو MTN)");
        return;
    }
    if (email && !emailRegex.test(email)) {
        alert("البريد الإلكتروني غير صحيح");
        return;
    }

    // حساب عدد أيام التأجير
    let days = Math.round((end - start) / (1000 * 60 * 60 * 24));

    let prices = document.getElementsByClassName("price");
    let checks = document.getElementsByClassName("selectMeal");

    let total = 0;
    let selectedCars = "";
    let hasSelection = false;

    for (let i = 0; i < checks.length; i++) {
        if (checks[i].checked) {
            hasSelection = true;
            let carName = checks[i].closest("tr").cells[2].innerText.trim();
            let pricePerDay = parseInt(prices[i].innerText.replace(/[^0-9]/g, "")) || 0;
            let carTotal = pricePerDay * days;
            total += carTotal;
            selectedCars += "- " + carName + " | " + days + " يوم | " + carTotal + " ل.س\n";
        }
    }

    if (!hasSelection) {
        alert("يرجى اختيار سيارة واحدة على الأقل.");
        return;
    }

    // خصم 10% إذا تجاوزت المدة 7 أيام
    let discount = 0;
    if (days > 7) {
        discount = total * 0.10;
    }
    let finalTotal = total - discount;

    alert("السيارات المختارة:\n" + selectedCars +
          "\nعدد أيام التأجير: " + days +
          "\nالمجموع قبل الخصم: " + total + " ل.س" +
          "\nالخصم: " + discount + " ل.س" +
          "\nالمبلغ النهائي: " + finalTotal + " ل.س");
}
