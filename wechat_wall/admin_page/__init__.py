WHETHER_REVIEW = 0
# 1: need to be reviewed
# 0: don't need


def get_whether_review():
    return WHETHER_REVIEW


def set_whether_review(whether_review):
    global WHETHER_REVIEW
    WHETHER_REVIEW = whether_review
