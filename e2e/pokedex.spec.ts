import { test, expect } from "@playwright/test";

test.describe("Pokédex Home Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("loading-indicator")).toBeHidden({
      timeout: 30_000,
    });
  });

  test("loads initial 10 Pokémon cards", async ({ page }) => {
    const cards = page.getByTestId(/^pokemon-card-/);
    await expect(cards).toHaveCount(10);
    await expect(page.getByTestId("pokemon-card-1")).toBeVisible();
    await expect(page.getByTestId("pokemon-card-1")).toContainText("#001");
    await expect(page.getByTestId("pokemon-card-1")).toContainText("bulbasaur");
    await expect(page.getByTestId("pokemon-card-1")).toContainText("grass");
  });

  test("load more adds additional Pokémon", async ({ page }) => {
    await expect(page.getByTestId(/^pokemon-card-/)).toHaveCount(10);
    await page.getByTestId("load-more-button").click();
    await expect(page.getByTestId(/^pokemon-card-/)).toHaveCount(20, {
      timeout: 30_000,
    });
    await expect(page.getByTestId("pokemon-card-11")).toBeVisible();
  });

  test("search filters by name", async ({ page }) => {
    await page.getByTestId("search-input").fill("char");
    await expect(page.getByTestId("pokemon-card-4")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("pokemon-card-4")).toContainText("charmander");
    await expect(page.getByTestId("pokemon-card-1")).toBeHidden();
  });

  test("search filters by ID", async ({ page }) => {
    await page.getByTestId("search-input").fill("025");
    await expect(page.getByTestId("pokemon-card-25")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.getByTestId("pokemon-card-25")).toContainText("pikachu");
  });

  test("sort by name reorders list", async ({ page }) => {
    await page.getByTestId("sort-select").selectOption("name");
    await expect(page.getByTestId("loading-indicator")).toBeHidden({
      timeout: 15_000,
    });
    await expect(page.getByTestId(/^pokemon-card-/)).toHaveCount(10);
    await expect(page.getByTestId("pokemon-card-460")).toBeVisible();
    await expect(page.getByTestId("pokemon-card-460")).toContainText("abomasnow");
    await expect(page.getByTestId("pokemon-card-1")).toBeHidden();
  });

  test("clicking card opens detail modal with weakness", async ({ page }) => {
    await page.getByTestId("pokemon-card-1").click();
    const modal = page.getByTestId("pokemon-modal");
    await expect(modal).toBeVisible();
    await expect(page.getByTestId("modal-pokemon-name")).toHaveText("bulbasaur");
    await expect(page.getByTestId("modal-pokemon-id")).toHaveText("#001");
    await expect(page.getByTestId("modal-types")).toContainText("grass");
    await expect(page.getByTestId("modal-weakness")).toContainText("flying");
    await expect(page.getByTestId("modal-weakness")).toContainText("fire");
    await expect(page.getByTestId("modal-height")).toBeVisible();
    await expect(page.getByTestId("modal-stats")).toBeVisible();
    await expect(page.getByTestId("modal-category")).toBeVisible({
      timeout: 15_000,
    });
  });

  test("modal next and previous navigate by ID", async ({ page }) => {
    await page.getByTestId("pokemon-card-1").click();
    await expect(page.getByTestId("modal-pokemon-name")).toHaveText("bulbasaur");

    await page.getByTestId("modal-next").click();
    await expect(page.getByTestId("modal-pokemon-name")).toHaveText("ivysaur", {
      timeout: 15_000,
    });
    await expect(page.getByTestId("modal-pokemon-id")).toHaveText("#002");

    await page.getByTestId("modal-previous").click();
    await expect(page.getByTestId("modal-pokemon-name")).toHaveText("bulbasaur", {
      timeout: 15_000,
    });
  });

  test("modal closes on close button", async ({ page }) => {
    await page.getByTestId("pokemon-card-1").click();
    await expect(page.getByTestId("pokemon-modal")).toBeVisible();
    await page.getByTestId("modal-close").click();
    await expect(page.getByTestId("pokemon-modal")).toBeHidden();
  });
});
