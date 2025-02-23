import { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [language, setLanguage] = useState(null);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    email: "",
    phone: "",
    choices: {},
  });
  const [currentStep, setCurrentStep] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState(""); // New state for input message
  const messagesEndRef = useRef(null);

  const [visible, setVisible] = useState(false);

  const translations = {
    en: {
      welcome: "Greetings from Novvi Properties. How can I assist you today?",
      propertyPurpose: "What is the purpose of your property investment?",
      budget: "What is your approximate budget?",
      propertyType: "Do you have a preferred property type?",
      location: "Which location do you prefer?",
      notFound:
        "Unfortunately, we couldn’t find the information you’re looking for. Please fill out the lead form for further assistance.",
      jobs: "Please visit our careers page at https://www.novviproperties.com/careers for job opportunities.",
      requestAgent:
        "Please provide your contact details, and a human agent will reach out to you shortly.",
      blogs:
        "Explore our latest blog posts at https://www.novviproperties.com/blog-listing.",
      changeLanguage: "Please select your preferred language: English, Arabic",
      default:
        "Could you please clarify? I’m here to assist with Property purchase, Jobs, Request Agent, Blogs, or Change language.",
      leadFormTitle: "Contact Information",
      leadFormName: "Your Name",
      leadFormEmail: "Email Address",
      leadFormPhone: "Mobile Number",
      leadFormSubmit: "Submit",
      leadFormThanks:
        "Thank you for the interaction. We are right here if you need us.",
    },
    ar: {
      welcome: "تحيات من مكتب مساعدة نوفي بروبرتيز.",
      propertyPurpose: "ما هو هدف استثمارك في العقارات؟",
      budget: "ما هو ميزانيتك التقريبية؟",
      propertyType: "هل لديك نوع عقاري مفضل؟",
      location: "أي موقع تفضله؟",
      notFound:
        "للأسف، لم نتمكن من العثور على المعلومات التي تبحث عنها. يرجى ملء استمارة الرصيد للمساعدة الإضافية.",
      jobs: "يرجى زيارة صفحة الوظائف الخاصة بنا على https://www.novviproperties.com/careers لفرص العمل.",
      requestAgent:
        "يرجى تقديم تفاصيل الاتصال الخاصة بك، وسيتواصل معك وكيل بشري قريبًا.",
      blogs:
        "استكشف أحدث منشورات المدونة لدينا على https://www.novviproperties.com/blog-listing.",
      changeLanguage: "يرجى اختيار اللغة المفضلة لديك: الإنجليزية، العربية",
      default:
        "هل يمكنك التوضيح؟ أنا هنا للمساعدة في شراء العقارات، الوظائف، طلب وكيل، المدونات، أو تغيير اللغة.",
      leadFormTitle: "معلومات الاتصال",
      leadFormName: "اسمك",
      leadFormEmail: "عنوان البريد الإلكتروني",
      leadFormPhone: "رقم الهاتف المحمول",
      leadFormSubmit: "إرسال",
      leadFormThanks: "شكرًا لتفاعلك. نحن هنا إذا احتجت إلينا.",
    },
  };

  // Auto-scroll effect triggered by relevant state changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, showLeadForm]);

  useEffect(() => {
    if (!language) {
      setMessages([
        {
          text: "Please select your preferred language: English, Arabic",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          lang: "en",
        },
      ]);
    }
  }, [language]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setMessages([
      {
        text: translations[lang].changeLanguage,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        lang,
      },
      {
        text: translations[lang].welcome,
        sender: "bot",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        lang,
      },
    ]);
    setCurrentStep(null);
    setShowLeadForm(false);
    setLeadData({ name: "", email: "", phone: "", choices: {} });
  };

  const handleOptionSelect = (option) => {
    const newUserMessage = {
      text: option,
      sender: "user",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      lang: language,
    };
    setMessages((prev) => [...prev, newUserMessage]);

    if (option.toLowerCase().trim() === "change language") {
      setLanguage(null);
      setMessages([
        {
          text: "Please select your preferred language: English, Arabic",
          sender: "bot",
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          lang: "en",
        },
      ]);
      setCurrentStep(null);
      setShowLeadForm(false);
      setLeadData({ name: "", email: "", phone: "", choices: {} });
      return;
    }

    setIsTyping(true);
    setTimeout(() => {
      const botResponse = getBotResponse(option, language);
      if (botResponse) {
        setMessages((prev) => [
          ...prev,
          {
            text: botResponse,
            sender: "bot",
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }),
            lang: language,
          },
        ]);
      }
      setIsTyping(false);
      updateStep(option);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newUserMessage = {
        text: inputMessage.trim(),
        sender: "user",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        }),
        lang: language,
      };
      setMessages((prev) => [...prev, newUserMessage]);
      setInputMessage(""); // Clear the input after sending

      setIsTyping(true);
      setTimeout(() => {
        const botResponse = getBotResponse(inputMessage.trim(), language);
        if (botResponse) {
          setMessages((prev) => [
            ...prev,
            {
              text: botResponse,
              sender: "bot",
              time: new Date().toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }),
              lang: language,
            },
          ]);
        }
        setIsTyping(false);
        updateStep(inputMessage.trim());
      }, 3000);
    }
  };

  const getBotResponse = (input, lang) => {
    const t = translations[lang];
    switch (input.toLowerCase().trim()) {
      case "property purchase":
        return t.propertyPurpose;
      case "rental returns":
      case "retirement":
      case "long-term gains":
      case "homeownership":
        updateLeadData("purpose", input);
        return t.budget;
      case "aed 1m - aed 3m":
      case "aed 3m - aed 5m":
      case "more than aed 5m":
        updateLeadData("budget", input);
        return t.propertyType;
      case "villa/townhouse":
      case "apartment":
        updateLeadData("propertyType", input);
        return t.location;
      case "dubai marina":
      case "palm jumeirah":
      case "downtown dubai":
        updateLeadData("location", input);
        setShowLeadForm(true);
        return t.notFound;
      case "jobs":
        return t.jobs;
      case "request agent":
        setShowLeadForm(true);
        return t.requestAgent;
      case "blogs":
        return t.blogs;
      case "change language":
        return "";
      case "english":
        handleLanguageChange("en");
        return "";
      case "arabic":
        handleLanguageChange("ar");
        return "";
      default:
        return t.default;
    }
  };

  const updateStep = (option) => {
    switch (option.toLowerCase().trim()) {
      case "property purchase":
        setCurrentStep("propertyPurpose");
        break;
      case "rental returns":
      case "retirement":
      case "long-term gains":
      case "homeownership":
        setCurrentStep("budget");
        break;
      case "aed 1m - aed 3m":
      case "aed 3m - aed 5m":
      case "more than aed 5m":
        setCurrentStep("propertyType");
        break;
      case "villa/townhouse":
      case "apartment":
        setCurrentStep("location");
        break;
      case "dubai marina":
      case "palm jumeirah":
      case "downtown dubai":
      case "request agent":
        setCurrentStep(null);
        setShowLeadForm(true);
        break;
      default:
        setCurrentStep(null);
    }
  };

  const updateLeadData = (key, value) => {
    setLeadData((prev) => ({
      ...prev,
      choices: { ...prev.choices, [key]: value },
    }));
  };

  const handleLeadSubmit = async (e) => {
    e.preventDefault();
    console.log(leadData);
    // try {
    //   const response = await fetch("http://localhost:5000/api/leads", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       ...leadData,
    //       choices: { ...leadData.choices, timestamp: new Date() },
    //     }),
    //   });
    //   if (response.ok) {
    //     setMessages((prev) => [
    //       ...prev,
    //       {
    //         text: translations[language].leadFormThanks,
    //         sender: "bot",
    //         time: new Date().toLocaleTimeString([], {
    //           hour: "2-digit",
    //           minute: "2-digit",
    //           hour12: true,
    //         }),
    //         lang: language,
    //       },
    //     ]);
    //     setShowLeadForm(false);
    //     setLeadData({ name: "", email: "", phone: "", choices: {} });
    //     setCurrentStep(null);
    //     setIsTyping(true);
    //     setTimeout(() => {
    //       setMessages([]);
    //       setIsTyping(false);
    //       setLanguage(null);
    //     }, 3000);
    //   } else {
    //     alert("Failed to submit lead information. Please try again.");
    //   }
    // } catch (error) {
    //   console.error("Error submitting lead:", error);
    //   alert("An error occurred. Please try again.");
    // }
  };

  const handleVisibilityChange = () => setVisible(!visible);

  return (
    <div
      className={`transition-all ease-in duration-200 overflow-hidden ${
        visible
          ? `lg:w-[450px] md:w-[450px] w-[370px]  h-[600px] shadow-lg`
          : "w-[60px] h-[60px] shadow-none flex items-center justify-center"
      } bg-[#fff] rounded-lg absolute bottom-5 right-5`}
    >
      <div
        onClick={() => handleVisibilityChange()}
        className={`transition-all ease-in duration-100 ${
          visible ? "hidden opacity-0" : "block opacity-100"
        }  w-[60px] h-[60px] flex items-center justify-center rounded-full bg-[#334044] shadow-lg cursor-pointer transition-all ease-in hover:scale-95`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width={30}
          height={30}
          className="text-white"
          fill={"none"}
        >
          <path
            d="M19 16V14C19 11.1716 19 9.75736 18.1213 8.87868C17.2426 8 15.8284 8 13 8H11C8.17157 8 6.75736 8 5.87868 8.87868C5 9.75736 5 11.1716 5 14V16C5 18.8284 5 20.2426 5.87868 21.1213C6.75736 22 8.17157 22 11 22H13C15.8284 22 17.2426 22 18.1213 21.1213C19 20.2426 19 18.8284 19 16Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M19 18C20.4142 18 21.1213 18 21.5607 17.5607C22 17.1213 22 16.4142 22 15C22 13.5858 22 12.8787 21.5607 12.4393C21.1213 12 20.4142 12 19 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15C2 13.5858 2 12.8787 2.43934 12.4393C2.87868 12 3.58579 12 5 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M12 5V8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9 13V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M15 13V14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10 17.5C10 17.5 10.6667 18 12 18C13.3333 18 14 17.5 14 17.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <div
        className={`transition-all ease-in duration-100  ${
          visible ? "block opacity-100" : "hidden opacity-0"
        }`}
      >
        <div className="flex justify-between items-center border-b p-4 bg-[#334044]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2 leading-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={36}
              height={36}
              className="text-inherit"
              fill={"none"}
            >
              <path
                d="M19 16V14C19 11.1716 19 9.75736 18.1213 8.87868C17.2426 8 15.8284 8 13 8H11C8.17157 8 6.75736 8 5.87868 8.87868C5 9.75736 5 11.1716 5 14V16C5 18.8284 5 20.2426 5.87868 21.1213C6.75736 22 8.17157 22 11 22H13C15.8284 22 17.2426 22 18.1213 21.1213C19 20.2426 19 18.8284 19 16Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M19 18C20.4142 18 21.1213 18 21.5607 17.5607C22 17.1213 22 16.4142 22 15C22 13.5858 22 12.8787 21.5607 12.4393C21.1213 12 20.4142 12 19 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M5 18C3.58579 18 2.87868 18 2.43934 17.5607C2 17.1213 2 16.4142 2 15C2 13.5858 2 12.8787 2.43934 12.4393C2.87868 12 3.58579 12 5 12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path
                d="M13.5 3.5C13.5 4.32843 12.8284 5 12 5C11.1716 5 10.5 4.32843 10.5 3.5C10.5 2.67157 11.1716 2 12 2C12.8284 2 13.5 2.67157 13.5 3.5Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M12 5V8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9 13V14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15 13V14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M10 17.5C10 17.5 10.6667 18 12 18C13.3333 18 14 17.5 14 17.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            NOVVI Assistant
          </h2>
          <button
            onClick={() => handleVisibilityChange()}
            className="text-white hover:text-gray-300 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="text-inherit"
              fill={"none"}
            >
              <path
                d="M19.0005 4.99988L5.00049 18.9999M5.00049 4.99988L19.0005 18.9999"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="h-[460px] overflow-y-auto scrollbar-hide space-y-4 p-4 pb-0 shadow-inner">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs p-3 rounded-lg ${
                  message.sender === "user"
                    ? "bg-[#334044] text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                <p>{message.text}</p>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <span className="loading loading-dots loading-md"></span>
          )}

          {showLeadForm ? (
            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <h3 className="text-xl font-semibold">
                {translations[language].leadFormTitle}
              </h3>
              <p>
                Please provide your contact details, and a human agent will
                reach out to you shortly.
              </p>
              <label className="floating-label">
                <span>Name</span>
                <input
                  type="text"
                  value={leadData.name}
                  onChange={(e) =>
                    setLeadData({ ...leadData, name: e.target.value })
                  }
                  placeholder={translations[language].leadFormName}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-none"
                  required
                />
              </label>
              <label className="floating-label">
                <span>Email</span>
                <input
                  type="email"
                  value={leadData.email}
                  onChange={(e) =>
                    setLeadData({ ...leadData, email: e.target.value })
                  }
                  placeholder={translations[language].leadFormEmail}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-none"
                  required
                />
              </label>
              <label className="floating-label">
                <span>Phone number</span>
                <input
                  type="tel"
                  value={leadData.phone}
                  onChange={(e) =>
                    setLeadData({ ...leadData, phone: e.target.value })
                  }
                  placeholder={translations[language].leadFormPhone}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-none"
                  required
                />
              </label>

              <button
                type="submit"
                className="bg-[#334044] text-white p-2 rounded-lg w-full"
              >
                {translations[language].leadFormSubmit}
              </button>
            </form>
          ) : (
            <div className="mt-4">
              {!language ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLanguageChange("en")}
                    className="btn btn-sm"
                  >
                    English
                  </button>
                  <button
                    onClick={() => handleLanguageChange("ar")}
                    className="btn btn-sm"
                  >
                    Arabic
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentStep === null && (
                    <div className="flex flex-row gap-2 flex-wrap">
                      <button
                        onClick={() => handleOptionSelect("Property purchase")}
                        className="btn btn-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={18}
                          className="text-inherit"
                          fill={"none"}
                        >
                          <path
                            d="M16 10L18.1494 10.6448C19.5226 11.0568 20.2092 11.2628 20.6046 11.7942C21 12.3256 21 13.0425 21 14.4761V22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M8 9L11 9M8 13L11 13"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M12 22V19C12 18.0572 12 17.5858 11.7071 17.2929C11.4142 17 10.9428 17 10 17H9C8.05719 17 7.58579 17 7.29289 17.2929C7 17.5858 7 18.0572 7 19V22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M2 22L22 22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M3 22V6.71724C3 4.20649 3 2.95111 3.79118 2.32824C4.58237 1.70537 5.74742 2.04355 8.07752 2.7199L13.0775 4.17122C14.4836 4.57937 15.1867 4.78344 15.5933 5.33965C16 5.89587 16 6.65344 16 8.16857V22"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Property purchase
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Jobs")}
                        className="btn btn-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={18}
                          className="text-inherit"
                          fill={"none"}
                        >
                          <path
                            d="M10 13.3333C10 13.0233 10 12.8683 10.0341 12.7412C10.1265 12.3961 10.3961 12.1265 10.7412 12.0341C10.8683 12 11.0233 12 11.3333 12H12.6667C12.9767 12 13.1317 12 13.2588 12.0341C13.6039 12.1265 13.8735 12.3961 13.9659 12.7412C14 12.8683 14 13.0233 14 13.3333V14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14V13.3333Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M13.9 13.5H15.0826C16.3668 13.5 17.0089 13.5 17.5556 13.3842C19.138 13.049 20.429 12.0207 20.9939 10.6455C21.1891 10.1704 21.2687 9.59552 21.428 8.4457C21.4878 8.01405 21.5177 7.79823 21.489 7.62169C21.4052 7.10754 20.9932 6.68638 20.4381 6.54764C20.2475 6.5 20.0065 6.5 19.5244 6.5H4.47562C3.99351 6.5 3.75245 6.5 3.56187 6.54764C3.00682 6.68638 2.59477 7.10754 2.51104 7.62169C2.48229 7.79823 2.51219 8.01405 2.57198 8.4457C2.73128 9.59552 2.81092 10.1704 3.00609 10.6455C3.571 12.0207 4.86198 13.049 6.44436 13.3842C6.99105 13.5 7.63318 13.5 8.91743 13.5H10.1"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M3.5 11.5V13.5C3.5 17.2712 3.5 19.1569 4.60649 20.3284C5.71297 21.5 7.49383 21.5 11.0556 21.5H12.9444C16.5062 21.5 18.287 21.5 19.3935 20.3284C20.5 19.1569 20.5 17.2712 20.5 13.5V11.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.5 6.5L15.4227 6.14679C15.0377 4.38673 14.8452 3.50671 14.3869 3.00335C13.9286 2.5 13.3199 2.5 12.1023 2.5H11.8977C10.6801 2.5 10.0714 2.5 9.61309 3.00335C9.15478 3.50671 8.96228 4.38673 8.57727 6.14679L8.5 6.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                        </svg>
                        Jobs
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Request Agent")}
                        className="btn btn-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={18}
                          className="text-inherit"
                          fill={"none"}
                        >
                          <path
                            d="M13 22H6.59087C5.04549 22 3.81631 21.248 2.71266 20.1966C0.453366 18.0441 4.1628 16.324 5.57757 15.4816C7.53058 14.3187 9.7927 13.8404 12 14.0466"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M15.5 6.5C15.5 8.98528 13.4853 11 11 11C8.51472 11 6.5 8.98528 6.5 6.5C6.5 4.01472 8.51472 2 11 2C13.4853 2 15.5 4.01472 15.5 6.5Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M20.4 20.4L22 22M21.2 17.6C21.2 15.6118 19.5882 14 17.6 14C15.6118 14 14 15.6118 14 17.6C14 19.5882 15.6118 21.2 17.6 21.2C19.5882 21.2 21.2 19.5882 21.2 17.6Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Request Agent
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Blogs")}
                        className="btn btn-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={18}
                          className="text-inherit"
                          fill={"none"}
                        >
                          <path
                            d="M18 15V9C18 6.17157 18 4.75736 17.1213 3.87868C16.2426 3 14.8284 3 12 3H8C5.17157 3 3.75736 3 2.87868 3.87868C2 4.75736 2 6.17157 2 9V15C2 17.8284 2 19.2426 2.87868 20.1213C3.75736 21 5.17157 21 8 21H20"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 8L14 8"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 12L14 12"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 16L10 16"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M18 8H19C20.4142 8 21.1213 8 21.5607 8.43934C22 8.87868 22 9.58579 22 11V19C22 20.1046 21.1046 21 20 21C18.8954 21 18 20.1046 18 19V8Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Blogs
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Change language")}
                        className="btn btn-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width={18}
                          height={18}
                          className="text-inherit"
                          fill={"none"}
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="1.5"
                          />
                          <path
                            d="M8 12C8 18 12 22 12 22C12 22 16 18 16 12C16 6 12 2 12 2C12 2 8 6 8 12Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 15H3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M21 9H3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Change language
                      </button>
                    </div>
                  )}
                  {currentStep === "propertyPurpose" && (
                    <div className="flex flex-row gap-2 flex-wrap">
                      <button
                        onClick={() => handleOptionSelect("Rental returns")}
                        className="btn btn-sm"
                      >
                        Rental returns
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Retirement")}
                        className="btn btn-sm"
                      >
                        Retirement
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Long-term gains")}
                        className="btn btn-sm"
                      >
                        Long-term gains
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Homeownership")}
                        className="btn btn-sm"
                      >
                        Homeownership
                      </button>
                    </div>
                  )}
                  {currentStep === "budget" && (
                    <div className="flex flex-row space-x-2 flex-wrap">
                      <button
                        onClick={() => handleOptionSelect("AED 1M - AED 3M")}
                        className="btn btn-sm"
                      >
                        AED 1M - AED 3M
                      </button>
                      <button
                        onClick={() => handleOptionSelect("AED 3M - AED 5M")}
                        className="btn btn-sm"
                      >
                        AED 3M - AED 5M
                      </button>
                      <button
                        onClick={() => handleOptionSelect("More than AED 5M")}
                        className="btn btn-sm"
                      >
                        More than AED 5M
                      </button>
                    </div>
                  )}
                  {currentStep === "propertyType" && (
                    <div className="flex flex-row space-x-2 flex-wrap">
                      <button
                        onClick={() => handleOptionSelect("Villa/Townhouse")}
                        className="btn btn-sm"
                      >
                        Villa/Townhouse
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Apartment")}
                        className="btn btn-sm"
                      >
                        Apartment
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Apartment")}
                        className="btn btn-sm"
                      >
                        Office
                      </button>
                    </div>
                  )}
                  {currentStep === "location" && (
                    <div className="flex flex-row space-x-2 flex-wrap">
                      <button
                        onClick={() => handleOptionSelect("Dubai Marina")}
                        className="btn btn-sm"
                      >
                        Dubai Marina
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Palm Jumeirah")}
                        className="btn btn-sm"
                      >
                        Palm Jumeirah
                      </button>
                      <button
                        onClick={() => handleOptionSelect("Downtown Dubai")}
                        className="btn btn-sm"
                      >
                        Downtown Dubai
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 flex items-center">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Type your message..."
            className="w-full p-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            onClick={handleSendMessage}
            className="bg-[#334044] h-[42px] text-white p-2 pr-4 rounded-r-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width={24}
              height={24}
              className="text-inherit rotate-45"
              fill={"none"}
            >
              <path
                d="M21.0477 3.05293C18.8697 0.707363 2.48648 6.4532 2.50001 8.551C2.51535 10.9299 8.89809 11.6617 10.6672 12.1581C11.7311 12.4565 12.016 12.7625 12.2613 13.8781C13.3723 18.9305 13.9301 21.4435 15.2014 21.4996C17.2278 21.5892 23.1733 5.342 21.0477 3.05293Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M11.5 12.5L15 9"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
