export default {
  formatTime(time) {
    // converts seconds to 00:00 format
    const minutes = Math.floor(time / 60) || 0;
    const seconds = Math.round(time % 60);

    return `${minutes}:${seconds < 10 ? 0 : ''}${seconds}`;
  },
};
