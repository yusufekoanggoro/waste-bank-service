const paging = (page, size, totalData = 0) => {
    return {
      page: parseInt(page),
      size: parseInt(size),
      totalPage: Math.ceil(totalData / parseInt(size)),
      totalData: totalData
    };
};

module.exports = {
    paging
}