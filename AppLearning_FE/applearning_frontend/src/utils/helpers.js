import userService from '../services/userService';

const KEY = 'user_hearts';

export const getHearts = async () => {
  const cached = localStorage.getItem(KEY);
  if (cached) {
    const { hearts, time } = JSON.parse(cached);
    if (Date.now() - time < 30000) return hearts;
  }

  try {
    const profile = await userService.getProfile();
    const hearts = profile.hearts ?? 5;

    localStorage.setItem(
      KEY,
      JSON.stringify({ hearts, time: Date.now() })
    );

    return hearts;
  } catch {
    return cached ? JSON.parse(cached).hearts : 5;
  }
};

export const deductHeart = async () => {
  const current = await getHearts();
  const newHearts = Math.max(0, current - 1);

  localStorage.setItem(
    KEY,
    JSON.stringify({ hearts: newHearts, time: Date.now() })
  );

  return newHearts;
};

export const refreshHearts = () => getHearts();
