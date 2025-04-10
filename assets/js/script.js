const tabList = document.querySelector("[data-js-list"),
  tabs = document.querySelectorAll("[data-js-tab"),
  tabPanels = document.querySelectorAll("[data-js-panel]");

tabList.setAttribute("role", "tablist");

tabList.querySelectorAll("li").forEach((lisItem) => {
  lisItem.setAttribute("role", "presentation");
});

tabPanels.forEach((panel) => {
  panel.setAttribute("role", "tabpanel");
});

function handleTabs(e) {
  e.preventDefault();
  const panelToShow = e.currentTarget.getAttribute("aria-describedby");
  tabPanels.forEach((panel) => {
    panel.setAttribute("aria-hidden", `${panel.id !== panelToShow ? true : false}`);
  });

  tabs.forEach((tab) => {
    tab.setAttribute("aria-selected", `${tab.id === e.currentTarget.id ? true : false}`);
  });

}

tabs.forEach((tab) => {
  tab.setAttribute("role", "tab");
  tab.addEventListener("click", handleTabs);
})

// !Helper function to format time
function formatTime(hours) {
  return hours === 1 ? `${hours}hour` : `${hours}hours`;
}

// !Helper function to handle keyboard navigation
function handleKeydown(e, index, lastTabIndex) {
  const key = e.key;
  let newIndex;

  switch (key) {
    case "ArrowRight":
      newIndex = (index === lastTabIndex) ? 0 : index + 1;
      break;
    case "ArrowLeft":
      newIndex = (index === 0) ? lastTabIndex : index - 1;
      break;
    case "Home":
      newIndex = 0;
      break;
    case "End":
      newIndex = lastTabIndex;
      break;
    default:
      return null;
  }

  return newIndex;
}

tabs.forEach((tab, index) => {
  tab.addEventListener("keydown", (e) => {
    const lastTabIndex = tabs.length - 1;
    const newIndex = handleKeydown(e, index, lastTabIndex);

    if (newIndex !== null) {
      tabs[newIndex].focus();
      tabs[newIndex].click();
    }
  });
});


// !Fetch data from data.json and populate the cards dynamically for multiple timeframes
fetch('./data.json')
  .then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    const [dailyPanel, weeklyPanel, monthlyPanel] = ["daily-panel", "weekly-panel", "monthly-panel"].map(id => document.getElementById(id));
    let dailyContent = "";
    let weeklyContent = "";
    let monthlyContent = "";

    // !Generate content for each panel
    data.forEach((item) => {
      dailyContent += `
        <div class="card__list-item">
          <article class="card card--${item.title.toLowerCase().replace(' ', '-')}">
            <div class="card__top">
              <img src="./assets/images/icon-${item.title.toLowerCase().replace(' ', '-')}.svg" alt="" aria-hidden="true" />
            </div>
            <div class="card__data">
              <div class="card__flex">
                <h2>
                  <a href="#" class="card__type">${item.title}</a>
                </h2>
                <img src="./assets/images/icon-ellipsis.svg" width="21" height="5" alt="" aria-hidden="true" />
              </div>
              <div class="card__flex">
                <p class="card__hours">${formatTime(item.timeframes.daily.current)}</p>
                <p class="card__previous">
                Yesterday - ${formatTime(item.timeframes.daily.previous)}
                </p>
              </div>
            </div>
          </article>
        </div>`;

      weeklyContent += `
        <div class="card__list-item">
          <article class="card card--${item.title.toLowerCase().replace(' ', '-')}">
            <div class="card__top">
              <img src="./assets/images/icon-${item.title.toLowerCase().replace(' ', '-')}.svg" alt="" aria-hidden="true" />
            </div>
            <div class="card__data">
              <div class="card__flex">
                <h2>
                  <a href="#" class="card__type">${item.title}</a>
                </h2>
                <img src="./assets/images/icon-ellipsis.svg" width="21" height="5" alt="" aria-hidden="true" />
              </div>
              <div class="card__flex">
                <p class="card__hours">${item.timeframes.weekly.current}hours</p>
                <p class="card__previous">Last Week - ${item.timeframes.weekly.previous}hours</p>
              </div>
            </div>
          </article>
        </div>`;

      monthlyContent += `
        <div class="card__list-item">
          <article class="card card--${item.title.toLowerCase().replace(' ', '-')}">
            <div class="card__top">
              <img src="./assets/images/icon-${item.title.toLowerCase().replace(' ', '-')}.svg" alt="" aria-hidden="true" />
            </div>
            <div class="card__data">
              <div class="card__flex">
                <h2>
                  <a href="#" class="card__type">${item.title}</a>
                </h2>
                <img src="./assets/images/icon-ellipsis.svg" width="21" height="5" alt="" aria-hidden="true" />
              </div>
              <div class="card__flex">
                <p class="card__hours">${item.timeframes.monthly.current}hours</p>
                <p class="card__previous">Last Month - ${item.timeframes.monthly.previous}hours</p>
              </div>
            </div>
          </article>
        </div>`;
    });

    // !Update the innerHTML of each panel
    dailyPanel.innerHTML = dailyContent;
    weeklyPanel.innerHTML = weeklyContent;
    monthlyPanel.innerHTML = monthlyContent;
  })
  .catch((error) => {
    console.error(`Error fetching data: ${error}`);
  });
