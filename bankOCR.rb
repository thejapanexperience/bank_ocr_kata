class Scan
  def initialize(input)
    puts 'Scanning now ...'
    puts input
    @input = input
    @digits
    @check = false
    @appended_digits
    @ref = {
      ' _ | ||_|' => 0,
      '     |  |' => 1,
      ' _  _||_ ' => 2,
      ' _  _| _|' => 3,
      '   |_|  |' => 4,
      ' _ |_  _|' => 5,
      ' _ |_ |_|' => 6,
      ' _   |  |' => 7,
      ' _ |_||_|' => 8,
      ' _ |_| _|' => 9
    }

    @num_bits = {
      one: [],
      two: [],
      three: [],
      four: [],
      five: [],
      six: [],
      seven: [],
      eight: [],
      nine: []
    }
  end

  def standardise
    origin_arr = @input.split("\n")
    split_arr = origin_arr.map do |a|
      a.split('')
    end
    27.times { split_arr[1] << ' ' } if split_arr[1].empty?
    split_arr.shift
    split_arr.each do |a|
      a << ' ' while a.size < 27
    end
    split_arr
  end

  def organise
    input = standardise
    for i in 0..2
      x = 0
      @num_bits.each do |_k, v|
        v.concat([input[i][x], input[i][x + 1], input[i][x + 2]])
        x += 3
      end
    end
    @num_bits
  end

  def user_story_1
    standardise
    organise
    puts 'Converting scan to digits...'
    digits = []
    @num_bits.each do |_k, v|
      str = v.join('')
      digits << if @ref[str]
                  @ref[str]
                else
                  '?'
                end
    end
    @digits = digits.join('')
    puts @digits
  end

  def user_story_2
    user_story_1
    puts 'Checking validity...'
    reversed_strings = @digits.split('').reverse
    reversed_ints = reversed_strings.map(&:to_i)
    check = false
    checksum = reversed_ints[0]
    reversed_ints.each_with_index do |n, i|
      checksum += ((i + 1) * n) unless i == 0
    end
    check = true if checksum % 11 == 0
    if check
      puts 'The number is valid.'
    else
      puts 'The number is invalid.'
    end
    @check = check
  end

  def user_story_3
    user_story_2
    puts 'Appending to invalid numbers or unreadable text...'
    num = @digits.to_i
    if @check
      puts 'Nothing to append.'
      @appended_digits = @digits
    elsif num && !@check
      puts "#{@digits} ERR"
      @appended_digits = "#{@digits} ERR"
    else
      puts "#{@digits} ILL"
      @appended_digits = "#{@digits} ILL"
    end
  end

  def user_story_4
    user_story_3
    puts "Checking for possible scanning errors..."
    
  end
end

test1 = "
 _  _  _  _  _  _  _  _  _
| || || || || || || || || |
|_||_||_||_||_||_||_||_||_|
"
test2 = "

  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
"
test3 = "
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
|_ |_ |_ |_ |_ |_ |_ |_ |_
"
test4 = "
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
 _| _| _| _| _| _| _| _| _|
"

test5 = "
    _  _     _  _  _  _  _
  | _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
"

test6 = "
    _  _  _  _  _  _     _
|_||_|| || ||_   |  |  | _
  | _||_||_||_|  |  |  | _|
"

test7 = "
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
|_||_||_||_||_||_||_||_||_|
"

test8 = ["

  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
", "
 _  _  _  _  _  _  _  _  _
  |  |  |  |  |  |  |  |  |
  |  |  |  |  |  |  |  |  |
", "
 _  _  _  _  _  _  _  _  _
 _|| || || || || || || || |
|_ |_||_||_||_||_||_||_||_|
", "
 _  _  _  _  _  _  _  _  _
 _| _| _| _| _| _| _| _| _|
 _| _| _| _| _| _| _| _| _|
", "
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
|_||_||_||_||_||_||_||_||_|
", "
 _  _  _  _  _  _  _  _  _
|_ |_ |_ |_ |_ |_ |_ |_ |_
 _| _| _| _| _| _| _| _| _|
", "
 _  _  _  _  _  _  _  _  _
|_ |_ |_ |_ |_ |_ |_ |_ |_
|_||_||_||_||_||_||_||_||_|
", "
 _  _  _  _  _  _  _  _  _
|_||_||_||_||_||_||_||_||_|
 _| _| _| _| _| _| _| _| _|
", "
    _  _  _  _  _  _     _
|_||_|| || ||_   |  |  ||_
  | _||_||_||_|  |  |  | _|
", "
    _  _     _  _  _  _  _
 _| _| _||_||_ |_   ||_||_|
  ||_  _|  | _||_|  ||_| _|
", "
 _     _  _  _  _  _  _
| || || || || || || ||_   |
|_||_||_||_||_||_||_| _|  |
", "
    _  _  _  _  _  _     _
|_||_|| ||_||_   |  |  | _
  | _||_||_||_|  |  |  | _|
"]

new_scan = Scan.new(test7)
# new_scan.standardise
new_scan.user_story_2
new_scan.user_story_4
