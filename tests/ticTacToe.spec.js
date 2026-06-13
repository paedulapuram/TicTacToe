const { test, expect } = require('@playwright/test');

async function playCells(page, cells) {
  for (const cell of cells) {
    await page.getByRole('gridcell', { name: cell }).click();
  }
}

test('plays a complete tic-tac-toe round where X wins', async ({ page }) => {
  await page.goto('/TicTacToe/');

  await expect(page).toHaveTitle(/Tic-Tac-Toe/);
  await expect(page.getByText('X starts the round.')).toBeVisible();

  await playCells(page, ['A1 empty', 'B1 empty', 'A2 empty', 'B2 empty', 'A3 empty']);

  await expect(page.getByText('X wins across the top row.')).toBeVisible();
  await expect(page.locator('#scoreX')).toHaveText('1');
  await expect(page.locator('.board-cell.is-winning')).toHaveCount(3);
  await expect(page.getByRole('gridcell', { name: 'C3 empty' })).toBeDisabled();
});

test('rejects an occupied square and keeps the turn with the same player', async ({ page }) => {
  await page.goto('/TicTacToe/');

  await page.getByRole('gridcell', { name: 'A1 empty' }).click();
  await page.getByRole('gridcell', { name: 'A1 X' }).click({ force: true });

  await expect(page.getByText("A1 is already filled. O's turn.")).toBeVisible();
  await expect(page.locator('#turnLabel')).toHaveText('O');
  await expect(page.locator('#moveList li')).toHaveCount(1);
});

test('records a draw and starts a clean new round', async ({ page }) => {
  await page.goto('/TicTacToe/');

  await playCells(page, [
    'A1 empty',
    'A2 empty',
    'A3 empty',
    'B1 empty',
    'B3 empty',
    'B2 empty',
    'C1 empty',
    'C3 empty',
    'C2 empty',
  ]);

  await expect(page.getByText('The round is a draw.')).toBeVisible();
  await expect(page.locator('#scoreDraws')).toHaveText('1');

  await page.getByRole('button', { name: 'New round' }).click();

  await expect(page.getByText('X starts the round.')).toBeVisible();
  await expect(page.locator('.board-cell.is-x, .board-cell.is-o')).toHaveCount(0);
  await expect(page.locator('#scoreDraws')).toHaveText('1');
  await expect(page.locator('#moveList li')).toHaveText('No moves');
});
