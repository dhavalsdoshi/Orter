require File.dirname(__FILE__) + '/../test_helper'

class DeeplinksHelperTest < ActiveSupport::TestCase
  include DeeplinksHelper

  def test_get_rows_for_sections_when_no_sections
    rows = get_rows_for_sections([])
    assert_equal [], rows
  end

  def test_get_rows_for_sections_when_one_row
    row_one, _ = get_rows_for_sections([1, 2, 3])
    assert_equal [1, 2, 3], row_one
  end

  def test_get_rows_for_sections_when_two_rows
    row_one, row_two = get_rows_for_sections([1, 2, 3, 4, 5, 6])
    assert_equal [1, 2, 3], row_one
    assert_equal [4, 5, 6], row_two
  end

  def test_get_rows_for_four_sections
    row_one, row_two = get_rows_for_sections([1, 2, 3, 4])
    assert row_one == [1, 2, 3]
    assert row_two == [4]
  end
end
