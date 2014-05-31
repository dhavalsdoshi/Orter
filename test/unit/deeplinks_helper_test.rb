require File.dirname(__FILE__) + '/../test_helper'

class DeeplinksHelperTest < ActiveSupport::TestCase
  include DeeplinksHelper

  def test_get_rows_for_sections_when_no_sections
    assert_equal [], get_rows_for_sections([])
  end

  def test_get_rows_for_sections_when_one_row
    assert_equal [[1, 2, 3]], get_rows_for_sections((1..3).to_a)
    assert_equal [[1]], get_rows_for_sections((1..1).to_a)
  end

  def test_get_rows_for_sections_when_two_rows
    row_one, row_two = get_rows_for_sections((1..6).to_a)
    assert_equal [1, 2, 3], row_one
    assert_equal [4, 5, 6], row_two
  end

  def test_get_rows_for_four_sections
    row_one, row_two = get_rows_for_sections((1..4).to_a)
    assert row_one == [1, 2]
    assert row_two == [3, 4]
  end

  def test_get_rows_for_seven_sections
    row_one, row_two, row_three = get_rows_for_sections((1..7).to_a)
    assert_equal row_one, [1, 2, 3]
    assert_equal row_two, [4, 5]
    assert_equal row_three, [6, 7]
  end

  def test_get_rows_for_ten_sections
    row_one, row_two, row_three, row_four = get_rows_for_sections((1..10).to_a)
    assert_equal row_one, [1, 2, 3]
    assert_equal row_two, [4, 5, 6]
    assert_equal row_three, [7, 8]
    assert_equal row_four, [9, 10]
  end
end
