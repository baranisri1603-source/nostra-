document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mainNav = document.querySelector("[data-main-nav]");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      mainNav.classList.toggle("is-open", !isOpen);
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        mainNav.classList.remove("is-open");
      });
    });
  }

  document.querySelectorAll("[data-dismiss-announcement]").forEach((button) => {
    button.addEventListener("click", () => {
      button.closest("[data-announcement]")?.remove();
    });
  });

  const searchInput = document.querySelector("[data-product-search]");
  const filterGroup = document.querySelector("[data-filter-group]");
  const productGrid = document.querySelector("[data-product-grid]");

  if (searchInput && filterGroup && productGrid) {
    const products = Array.from(productGrid.querySelectorAll("[data-product]"));
    const filterButtons = Array.from(filterGroup.querySelectorAll("[data-filter]"));
    const sortSelect = document.querySelector("[data-product-sort]");
    const countLabel = document.querySelector("[data-product-count]");
    const emptyState = document.querySelector("[data-empty-state]");
    const clearButton = document.querySelector("[data-search-clear]");
    let activeCategory = "all";

    const updateProducts = () => {
      const query = searchInput.value.trim().toLocaleLowerCase();
      const visibleProducts = products.filter((product) => {
        const matchesCategory = activeCategory === "all" || product.dataset.category === activeCategory;
        const searchableText = `${product.dataset.name} ${product.dataset.category} ${product.textContent}`.toLocaleLowerCase();
        return matchesCategory && searchableText.includes(query);
      });

      const sortOrder = sortSelect ? sortSelect.value : "featured";
      visibleProducts.sort((first, second) => {
        if (sortOrder === "low-high") return Number(first.dataset.price) - Number(second.dataset.price);
        if (sortOrder === "high-low") return Number(second.dataset.price) - Number(first.dataset.price);
        if (sortOrder === "name") return first.dataset.name.localeCompare(second.dataset.name);
        return products.indexOf(first) - products.indexOf(second);
      });

      products.forEach((product) => {
        product.hidden = !visibleProducts.includes(product);
      });
      visibleProducts.forEach((product) => productGrid.append(product));

      if (countLabel) {
        countLabel.textContent = `Showing ${visibleProducts.length} ${visibleProducts.length === 1 ? "piece" : "pieces"}`;
      }
      if (emptyState) emptyState.hidden = visibleProducts.length !== 0;
      if (clearButton) clearButton.hidden = searchInput.value.length === 0;
    };

    filterGroup.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (!button) return;
      activeCategory = button.dataset.filter;
      filterButtons.forEach((filterButton) => {
        const isActive = filterButton === button;
        filterButton.classList.toggle("active", isActive);
        filterButton.setAttribute("aria-pressed", String(isActive));
      });
      updateProducts();
    });

    searchInput.addEventListener("input", updateProducts);
    sortSelect?.addEventListener("change", updateProducts);
    clearButton?.addEventListener("click", () => {
      searchInput.value = "";
      searchInput.focus();
      updateProducts();
    });
    document.querySelector("[data-reset-products]")?.addEventListener("click", () => {
      searchInput.value = "";
      activeCategory = "all";
      filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === "all";
        button.classList.toggle("active", isActive);
        button.setAttribute("aria-pressed", String(isActive));
      });
      if (sortSelect) sortSelect.value = "featured";
      updateProducts();
    });

    document.querySelectorAll("[data-category-link]").forEach((link) => {
      link.addEventListener("click", () => {
        sessionStorage.setItem("nostra-category", link.dataset.categoryLink);
      });
    });

    const requestedCategory = sessionStorage.getItem("nostra-category");
    if (requestedCategory && filterButtons.some((button) => button.dataset.filter === requestedCategory)) {
      sessionStorage.removeItem("nostra-category");
      const requestedButton = filterButtons.find((button) => button.dataset.filter === requestedCategory);
      requestedButton.click();
    } else {
      updateProducts();
    }

    productGrid.addEventListener("click", (event) => {
      const button = event.target.closest("[data-add-to-bag]");
      if (!button) return;
      button.classList.add("added");
      button.innerHTML = 'Added to bag <span aria-hidden="true">✓</span>';
      button.setAttribute("aria-label", `${button.closest("[data-product]").dataset.name} added to bag`);
      window.setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = 'Add to bag <span aria-hidden="true">+</span>';
        button.removeAttribute("aria-label");
      }, 1600);
    });
  }

  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector("[data-newsletter-feedback]");
      if (feedback) feedback.textContent = "Thanks for joining us. This demo form is not connected to a mailing list.";
      form.reset();
    });
  });

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = contactForm.querySelector("[data-contact-feedback]");
      if (feedback) {
        feedback.textContent = "Thanks — your message is ready. This demo form is not connected to an inbox.";
        feedback.classList.add("is-success");
      }
      contactForm.reset();
    });
  }
});
