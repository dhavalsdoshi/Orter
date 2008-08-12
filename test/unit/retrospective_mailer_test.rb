require 'test_helper'

class RetrospectiveMailerTest < ActionMailer::TestCase
  tests RetrospectiveMailer
  def test_new_retro
    @expected.subject = 'RetrospectiveMailer#new_retro'
    @expected.body    = read_fixture('new_retro')
    @expected.date    = Time.now

    assert_equal @expected.encoded, RetrospectiveMailer.create_new_retro(@expected.date).encoded
  end

end
