function addClassWarning(num) {
  var className = "card-header ch-alt"
  var color = ""

  if (50 < num && num < 80) {
    color = " bgm-orange txt-white"
  } else if (num > 80) {
    color = " bgm-red txt-white"
  } else if (50 > num && num > 0) {
    color = " bgm-lightgreen"
  } else {
    color = ""
  }

  return className + color
}

export function checkPercentWarning(num) {
  if (num) {
    num = num.toLowerCase()
  } else {
    num = "0"
  }

  if (num.includes("%")) {
    num = parseFloat(num.replace("%", ""))
  } else {
    num = parseFloat(num)
  }

  return addClassWarning(num)
}

export function checkTrafficWarning(num) {
  var traffic_init = ["kb/s", "mb/s", "kbps", "mbps"]
  if (num) {
    num = num.toLowerCase()
  } else {
    num = "0"
  }
  for (var i=0; i < traffic_init.length; i++) {
    if (typeof num == "string") {
      if (num.includes(traffic_init[i])) {
        num = parseFloat(num.replace(traffic_init[i], ""))
      }
    }
  }

  num = parseFloat(num)

  return addClassWarning(num)
}